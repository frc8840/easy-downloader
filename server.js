require("dotenv").config();
const http = require('http');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const ip = require('ip');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    } else if (req.url === '/team_8840_project') {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        zip().then(() => {
            res.end(fs.readFileSync(path.join(__dirname, 'team_8840_project.zip')));
            console.log("Downloaded!")
        });
    } else if (req.url === '/easy_downloader') {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        zip(true).then(() => {
            res.end(fs.readFileSync(path.join(__dirname, 'this_project.zip')));
            console.log("Downloaded easy-downloader.")
        })
    } else if (req.url == "/rev") {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        zipDir(revLocation).then(() => {
            res.end(fs.readFileSync(path.join(__dirname, 'custom.zip')));
            console.log("Downloaded custom rev.")
        })
    } else if (req.url == "/cust") {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        zipDir(customPath).then(() => {
            res.end(fs.readFileSync(path.join(__dirname, 'custom.zip')));
            console.log("Downloaded custom path from " + customPath);
        })
    } else if (req.url == "/newp") {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        zipDir(newProject).then(() => {
            res.end(fs.readFileSync(path.join(__dirname, 'custom.zip')));
            console.log("Downloaded custom newp.")
        });
    } else if (req.url == "/latest") {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        zipDir(latest).then(() => {
            res.end(fs.readFileSync(path.join(__dirname, 'custom.zip')));
            console.log("Downloaded custom latest.")
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

const directoryLocation = path.join(__dirname, '../example');
const thisLocation = path.join(__dirname, '../easy-downloader');
const revLocation = path.join(__dirname, '../rev-setup');
const newProject = path.join(__dirname, '../2022_project');
const latest = path.join(__dirname, '../latest');

const customPath = path.join(process.env.IDEA_PROJECTS, "image-testing")

//Zip the directory using the directoryLocation
function zip(isThis=false) {
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    const location = path.join(__dirname, isThis ? 'this_project.zip' : 'team_8840_project.zip')
    const output = fs.createWriteStream(location);
    
    return new Promise((res, rej) => {
        output.on('close', () => {
            res();
        })

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
                console.warn(err);
            } else {
                // throw error
                rej(err);
            }
        });
    
        archive.pipe(output);
        archive.directory(isThis ? thisLocation : directoryLocation, false);
        archive.finalize();
    })
}

function zipDir(dir) {
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    const output = fs.createWriteStream(path.join(__dirname, 'custom.zip'));
    
    return new Promise((res, rej) => {
        output.on('close', () => {
            res();
        })

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
                console.warn(err);
            } else {
                // throw error
                rej(err);
            }
        });
    
        archive.pipe(output);
        archive.directory(dir, false);
        archive.finalize();
    })
}

const PORT = 3000;

//Host the server
server.listen(PORT, () => {
    console.log('Server running on port 3000.');
    console.log(`Go to http://${ip.address()}:${PORT} to download.`);
});
