import { releasesToKeep } from '../src/main';

describe('release retention function', () => {
    it('releasesToKeep to be defined', () => {
        expect(releasesToKeep).toBeDefined();
    });

    it('Keep 1 release for every project/environment combination', () => {
        expect(releasesToKeep(1)).toStrictEqual([
            {
                Id: 'Release-1',
                ProjectId: 'Project-1',
                Version: '1.0.0',
                Created: '2000-01-01T09:00:00'
            },
            {
                Id: 'Release-2',
                ProjectId: 'Project-1',
                Version: '1.0.1',
                Created: '2000-01-02T09:00:00'
            },
            {
                Id: 'Release-7',
                ProjectId: 'Project-2',
                Version: '1.0.3',
                Created: '2000-01-02T12:00:00'
            },
            {
                Id: 'Release-6',
                ProjectId: 'Project-2',
                Version: '1.0.2',
                Created: '2000-01-02T09:00:00'
            },
            {
                Id: 'Release-8',
                ProjectId: 'Project-3',
                Version: '2.0.0',
                Created: '2000-01-01T09:00:00'
            }
        ]);
    });

    it('Keep 10 releases for every project/environment combination', () => {
        // this should max out to all valid releases as there aren't any more than 4 releases
        // per project/environment combination with the Releases.json dataset
        expect(releasesToKeep(10)).toStrictEqual([
            {
                Id: 'Release-1',
                ProjectId: 'Project-1',
                Version: '1.0.0',
                Created: '2000-01-01T09:00:00'
            },
            {
                Id: 'Release-2',
                ProjectId: 'Project-1',
                Version: '1.0.1',
                Created: '2000-01-02T09:00:00'
            },
            {
                Id: 'Release-7',
                ProjectId: 'Project-2',
                Version: '1.0.3',
                Created: '2000-01-02T12:00:00'
            },
            {
                Id: 'Release-6',
                ProjectId: 'Project-2',
                Version: '1.0.2',
                Created: '2000-01-02T09:00:00'
            },
            {
                Id: 'Release-5',
                ProjectId: 'Project-2',
                Version: '1.0.1-ci1',
                Created: '2000-01-01T10:00:00'
            },
            {
                Id: 'Release-8',
                ProjectId: 'Project-3',
                Version: '2.0.0',
                Created: '2000-01-01T09:00:00'
            }
        ]);
    });

    it('Keep 0', () => {
        expect(releasesToKeep(0)).toStrictEqual([]);
    });

    it('Keep -1', () => {
        expect(releasesToKeep(-1)).toStrictEqual([]);
    });

});
