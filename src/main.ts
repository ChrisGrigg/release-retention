// Aim of this is to create an array of dictionaries that contain FIFO queues (arrays)
// of each environment/project combination. Then loop through this array taking n
// releases off each queue.
//
// [
//      'Project-1_Environment-1': [{ Release_1 ... }, { Release_5 ...}],
//      'Project-1_Environment-2': [{ Release_6 ... }, { Release_8 ...}],
//      'Project-3_Environment-1': [{ Release_3 ... }, { Release_2 ...}],
// ]
//
// TODO WITH MORE TIME
//  - add logging utility component that records console.log and sends to DB or 3rd party service
//  - add more detailed logging such as 'it was the 2nd release added to environment 1 which is "Staging"'
//  - add unit tests with more data and broken data
//

import * as deploymentsJSON from "../data/Deployments.json";
import * as releasesJSON from "../data/Releases.json";

interface Release {
    Id: string;
    ProjectId: string;
    Version: string;
    Created: string;
}

interface Deployment {
    Id: string;
    ReleaseId: string;
    EnvironmentId: string;
    DeployedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUniqueListBy(arr: any[], key: string): Deployment[] {
    // a different (es6+) way of creating a Map than the
    // 'releasesToKeep' function below as this is a showcase
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function releasesToKeep(n: number): Release[] {
    if (!n || n <= 0) {
        console.log('n is not valid');
        return [];
    }
    const deployments = deploymentsJSON['default'];
    const deploymentsSorted: Deployment[] = deployments.sort((a: Deployment, b: Deployment) => Date.parse(a.DeployedAt) - Date.parse(b.DeployedAt));
    const deploymentsCleaned: Deployment[] = getUniqueListBy(deploymentsSorted, 'ReleaseId');
    const releases = releasesJSON['default'];

    // first create an object with keys that correspond to releases
    // the alternative is a nested loop which would be 0(n*m)
    const deploymentsMap = {};
    for (const deployment of deploymentsCleaned) {
        const key = deployment.ReleaseId;
        if (!deploymentsMap[key]) {
            deploymentsMap[key] = [];
        }
        deploymentsMap[key].push(deployment);
    }

    // go through each key in the deployments map that
    // correspond to the releases array 'Id'
    const releasesMap = {};
    for (const release of releases) {
        const currentDeployments = deploymentsMap[release.Id];
        if (currentDeployments) {
            for (const currentDeployment of currentDeployments) {
                if (release.Id === currentDeployment.ReleaseId) {
                    // create an FIFO queue based on object key of project ID combined with environment ID
                    const key = `${release.ProjectId}_${currentDeployment.EnvironmentId}`;
                    if (!releasesMap[key]) {
                        releasesMap[key] = [];
                    }
                    // unshift will make this a FIFO queue
                    // this could be another component such as 'queue' but
                    // perhaps that's overkill for such a small project
                    releasesMap[key].unshift(release);
                }
            }
        }
    }

    // now loop through the releases map object one by one
    // then take off a specific amount of releases from each queue
    const releasesToKeep: Release[] = [];
    for (const key in releasesMap) {
        let counter = 0;
        const current = releasesMap[key];
        for (let i = 0; i < current.length; i++) {
            if (n >= counter) {
                releasesToKeep.push(current[i]);
                counter++;

                const releaseId = current[i].Id;
                const environmentId = key.split('_')[1];
                console.log(`${releaseId} kept because it was the most recently deployed to ${environmentId}`);
            } else {
                i++;
            }
        }
    }

    return releasesToKeep;
}
