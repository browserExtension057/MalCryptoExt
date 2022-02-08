/*
 * Genertate the AST from JS code and statistic the number of each Type
*/

// start running: node ./ast_babel.js

import { parse } from '@babel/parser';
import esprima from 'esprima';

import fs from 'fs';

var walk = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        if (file != '.DS_Store') {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(walk(file));
            } else {
                /* Is a file */
                results.push(file);
            }
        }
    });
    return results;
}

function generate_ast(dir) {
    var js_file = walk(dir);
    js_file.forEach(function (p) {
        if(p.slice(-3)=='.js'){
            
            console.log(p);
            fs.readFile(p, { encoding: 'utf-8' }, function (err, data) {
                try {
                    const ast = parse(data);
                    fs.writeFile(p.slice(0, -3) + '.json', JSON.stringify(ast), error => {
                        if (error) {
                            console.error(error);
                            // continue;
                        }
                    });
                }
                catch (e) {
                    console.error('skip a file at parsing ' + p);
                }
                try {
                    // count the type number
                    var ast_type = esprima.tokenize(data);
                    fs.writeFile(p.slice(0, -3) + '_type.json', JSON.stringify(ast_type), error => {
                        if (error) {
                            console.error(error);
                            // return;
                        }
                    });
                } catch (e) {
                    console.error('skip a file at type ' + p);
                }
            });
        }
    });

}
// const dir = './ClearJS/';
const dir='/Users/a057/Desktop/Project/Code/AST/dataset/all_malicious/all/clearJS';
generate_ast(dir);

