const express = require('express'),
    router = express.Router(),
    path = require('path'),
    jimp = require("jimp"),
    tmp = require('tmp'),
    quantize = require('quantize'),
    Promise = require('bluebird');

const getPixels = Promise.promisify(require("get-pixels"));

router.get('/', (req, res, next) => {
    let filePathAndName = path.join(__dirname, '..', 'images', 'RunningFox.jpg');


    // tmp.file( (err, path, fd, cleanupCallback) => {
    //     if (err) throw err;
    //
    //     console.log('File: ', path);
    //     console.log('Filedescriptor: ', fd);
    //
    //     // If we don't need the file anymore we could manually call the cleanupCallback
    //     // But that is not necessary if we didn't pass the keep option because the library
    //     // will clean after itself.
    //     cleanupCallback();
    // });
    Promise.resolve(path.join(__dirname, '..', 'images',`_${path.parse(filePathAndName).name}${path.parse(filePathAndName).ext}`))
    .then((newFileName)=>{
        return Promise.all([
            jimp.read(filePathAndName),
            newFileName
        ]);
    })
    .then(([jfile,newFileName])=> {
        return Promise.all([
            jfile.scaleToFit( 50, 50 ),
            newFileName
        ]);
    })
    .then(([jfile,newFileName])=> {
        return Promise.all([
            jfile,
            // jfile.pixelate( 2 ),
            newFileName
        ]);
    })
    .then(([jfile,newFileName])=> {
        return Promise.all([
            jfile.write(newFileName),
            newFileName
        ]);
    })
    .then(([jfile,newFileName])=>{
        return Promise.all([
            getPixels(newFileName),
            newFileName
        ]);
    })
    .then(([pixels,newFileName])=>{

        let {data, shape, stride, offset} = pixels;

        let [nx, ny, nz] = shape;
        // ny is number of y
        // nx is number of x
        // nz is the number of color indexes, I looked in the code, and it looks like gif, bmp, jpeg, and png is always 4

        let pixelHtml = '';
        // let colorCodes = {};
        // let colorCount = 1;

        let arrayOfPixels = [];
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                let red = pixels.get(x, y, 0);
                let green = pixels.get(x, y, 1);
                let blue = pixels.get(x, y, 2);
                arrayOfPixels.push([red,green,blue]);
            }
        }
        let maximumColorCount = 16;
        let cmap = quantize(arrayOfPixels, maximumColorCount);

        for (let y = 0; y < ny; y++) {
            pixelHtml += '<div class="row">';
            for (let x = 0; x < nx; x++) {
                // let red = pixels.get(x, y, 0);
                // let green = pixels.get(x, y, 1);
                // let blue = pixels.get(x, y, 2);
                // let opacity = (pixels.get(x, y, 3) / 255);

                let [red,green,blue]= cmap.map([pixels.get(x, y, 0),pixels.get(x, y, 1),pixels.get(x, y, 2)]);

                // let { colorCode, button } = (colorCodes[`${red}${green}${blue}`])?colorCodes[`${red}${green}${blue}`]:{colorCode:null,button:null};
                //
                // let cc = '';
                // if ( `${red}${green}${blue}` === '254254254' ) {
                //     // skip white
                // } else {
                //     if ( colorCode === null && button === null ) {
                //         // add a color to the colorCodes.
                //         colorCount++;
                //         colorCodes[`${red}${green}${blue}`] = { colorCode: colorCount, button: `<div style=\"background-color: rgba(${red}, ${green}, ${blue}, ${opacity});\">${colorCount}</div>` };
                //     }
                //     cc = colorCodes[`${red}${green}${blue}`].colorCode;
                // }
                // pixelHtml += `<div>${cc}</div>`;

                pixelHtml += `<div style=\"background-color: rgb( ${red}, ${green}, ${blue} );\"></div>`;
            }
            pixelHtml += '</div>';
        }
        // each div is...
        // height: 10px;
        //  width: 10px;
        // margin: 1px;
        //        ----
        //        2 + 10 per x and y
        let divHeight = 10;
        let divWidth = 10;
        let margin = 1;
        let border = 1;
        let containerWidth = nx * ( ( margin * 2  ) + ( border * 2 ) + divWidth);
        let containerHeight = ny * ( ( margin * 2  ) + ( border * 2 ) + divHeight);

        let colorButtons = '';
        // for(let prop in colorCodes) {
        //     colorButtons += colorCodes[prop].button;
        // }

        res.render('index', { title: 'Express', pixelHtml, containerWidth, containerHeight, colorButtons, divHeight, divWidth } );

    })
    .catch(function (err) {
        console.error(err);
    });
});

module.exports = router;
