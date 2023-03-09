const http = require('http');
const url = require( "url");
const {hostId,userId,password,database,port} =require("../../config.json");

const MysqlPool=require('../uitl/dataUitl');
const sqlCon= new MysqlPool({
    host: hostId,
    user: userId,
    password: password,
    database: database,
    port:port
})

function serverStart(){
    http.createServer((req, res) => {
        // 监听 POST 请求
        const { pathname } = url.parse(req.url, true);
        if (req.method === 'POST' && pathname === '/add' ) {
            let body = '';
            req.on('data', (data) => {
                body += data;
                console.log("接收到Post的请求");
            });
            req.on('end',async() => {
                try{
                    let data = JSON.parse(body);
                    let data_res=await sqlCon.insert('pre_config',data);
                    console.log(data_res);
                    res.end(JSON.stringify(data_res));
                }
                catch (error) {
                    console.error(`解析请求体为 JSON 对象出错：${error.message}`);
                    res.statusCode = 400;
                    res.end('请求体解析错误');
                }
            });
        }
        else if (req.method === 'POST' && pathname === '/addMulti' ) {
            let body = '';
            req.on('data', (data) => {
                body += data;
                console.log("接收到Post的请求");
            });
            req.on('end',async() => {
                try{
                    let data = JSON.parse(body);
                    console.log(data);
                    for(let item of data){
                        await sqlCon.insert('pre_config',item);
                    }
                    res.end("添加成功");
                }
                catch (error) {
                    console.error(`解析请求体为 JSON 对象出错：${error.message}`);
                    res.statusCode = 400;
                    res.end('添加失败');
                }
            });
        }
        else if (req.method === 'POST' && pathname === '/delete' ) {
            let body = '';
            req.on('data', (data) => {
                body += data;
                console.log("接收到Post的请求");
            });
            req.on('end',async() => {
                try{
                    let data = JSON.parse(body);
                    let data_res=await sqlCon.delete('pre_config',data);
                    console.log(data_res);
                    res.end(JSON.stringify(data_res));
                }
                catch (error) {
                    console.error(`解析请求体为 JSON 对象出错：${error.message}`);
                    res.statusCode = 400;
                    res.end('请求体解析错误');
                }
            });
        }
        else if (req.method === 'POST' && pathname === '/update' ) {
            let body = '';
            req.on('data', (data) => {
                body += data;
                console.log("接收到Post的请求");
            });
            req.on('end',async() => {
                try{
                    let data = JSON.parse(body);
                    console.log(data);
                    let data_res=await sqlCon.update('pre_config',data.data,data.where);
                    console.log(data_res);
                    res.end(JSON.stringify(data_res));
                }
                catch (error) {
                    console.error(`解析请求体为 JSON 对象出错：${error.message}`);
                    res.statusCode = 400;
                    res.end('请求体解析错误');
                }
            });
        }
        else if (req.method === 'GET' && pathname === '/data' ) {
            let body = '';
            req.on('data', (data) => {
                body += data;
                console.log("接收到Get请求");
            });
            req.on('end',   async () => {
                try{
                    let data_res=await sqlCon.select('pre_config');
                    console.log(data_res);
                    res.end(JSON.stringify(data_res));
                }
                catch (error) {
                    console.error(`解析请求体为 JSON 对象出错：${error.message}`);
                    res.statusCode = 400;
                    res.end('请求体解析错误');
                }
            });
        }
        else if (req.method === 'GET' && pathname === '/unpre' ) {
            let body = '';
            req.on('data', (data) => {
                body += data;
                console.log("接收到Get请求");
            });
            req.on('end',  async () => {
                try{
                    let data_res=await sqlCon.select('unst_config');
                    console.log(data_res);
                    res.end(JSON.stringify(data_res));
                }
                catch (error) {
                    console.error(`解析请求体为 JSON 对象出错：${error.message}`);
                    res.statusCode = 400;
                    res.end('请求体解析错误');
                }
            });
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('不支持该请求方法\n');
            res.end();
        }
    }).listen(3000, () => {
        console.log('Node.js 服务已启动，正在监听 3000 端口');
    });
}
module.exports = serverStart;