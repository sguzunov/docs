var distPath = process.argv[2];
var name = process.argv[3];
var version = 0;

archive(distPath, `${name}.zip`);

function archive(path, name) {

    var file_system = require('fs');
    var archiver = require('archiver');

    var output = file_system.createWriteStream(name);
    var archive = archiver('zip');

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);
    archive.directory(path, false);
    archive.finalize();
}