# GID

### Set IP of web server
Set ip address in gid_rest/public/js/service.js:8
>  var localIP = '192.168.0.191'; 

### How to run
> $ ./startGID.sh

#### Starting Blockchain 
> $ cd gid_blockchain/gid/  
> $ ./startFabric.sh  

#### Starting REST API
> $ cd ../gid_rest/  
> $ ./start.sh  

note: 첫 실행 시 npm install을 해야 함.
 
