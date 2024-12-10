import * as Path from 'path';

export class FileExplorer {
    private _currentPath!: string;

    public constructor(currentPath: string = '.') {
        this.cd(currentPath);
    }

    public cd(path: string) {
        this._currentPath = Path.resolve(process.cwd(), path);
    }

    public get cwd(): string {
        return this._currentPath;
    }

    public pwd(): void {
        console.log(this._currentPath);
    }
}