import { FileExplorer } from "./file.explorer";

describe('FileExporer', () => {

    it('should create FileExplorer instance', () => {
        const fe = new FileExplorer();
        expect(fe).toBeInstanceOf(FileExplorer);
    });
});
