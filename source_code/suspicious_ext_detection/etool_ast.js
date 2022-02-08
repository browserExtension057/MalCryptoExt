import esprima from 'esprima'
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
function handle_one_file(p,output){
    fs.readFile(p, {encoding: 'utf-8'}, function(err,data){
        // extract node type
        // calculate the times each function being called
        var callee_info=new Array();
        try{
            esprima.parseScript(data, {}, function (node,meta) {

                if(node.type=="CallExpression"){
                    var function_name=node.callee.name;
                    // console.log('call the function:'+function_name);
                    var founded=0;
                    for (var i=0;i<callee_info.length;i++){
                        if(function_name==callee_info[i]['name']){
                            callee_info[i]['num']++;
                            founded=1;
                        }
                    }
                    if(!founded){
                        // a new function
                        var tmp={
                            'name':function_name,
                            'num':1
                        };
                        callee_info.push(tmp);
                    }
                }
            });
        } catch(e){
            console.error('skip a file at type ' + p);
        }
        

        // convert JSON object to string
        const callee_info_data = JSON.stringify(callee_info);
        // write JSON string to a file
        fs.writeFile(output, callee_info_data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });

}
function get_callee_num(dir){
    var js_file = walk(dir);
    js_file.forEach(function (p) {
        if(p.slice(-3)==".js"){
            console.log(p);
            var output=p.slice(0, -3) + '_callee.json'
            handle_one_file(p,output);
        }
        
    });
}
function handle_purify(p,output){
    // const tmp = new Array();
    fs.readFile(p, {encoding: 'utf-8'}, function(err,data){
        const tmp = new Array();
        var content=JSON.parse(data);
        content.forEach(function (item){
            // console.log(item["name"]);
            // console.log(typeof item["name"]);
            var name=item["name"];
            if(typeof name !== "undefined" && item["name"].length>3 && item["name"].slice(0,3)!="_0x"){
                //&& item["name"].length>2
                tmp.push(item);
                // console.log("add:"+name);
            }
            // else{
            //     console.log(item["name"]);
            // }
        });

        // console.log(tmp);
        // write the content into the output file
        const purify_data = JSON.stringify(tmp);
            // write JSON string to a file
            fs.writeFile(output, purify_data, (err) => {
                if (err) {
                    throw err;
                }
                // console.log("JSON data is saved.");
            });
    });
    
}
function purify_callee(dir){
    var js_file = walk(dir);
    js_file.forEach(function (p) {
        if(p.slice(-12)=="_callee.json"){
            console.log(p);
            var output=p.slice(0, -12) + '_purify_callee.json'
            handle_purify(p,output);
        }
        
        
    });
}
// find . -name "*purify_callee.json" |xargs rm -rf
// before running, delete the old file
const dir = './dataset/all_malicious/gambling/clearJS';
// const dir='/Users/a057/Downloads/chrome/ClearJS';
get_callee_num(dir);
// purify_callee(dir);