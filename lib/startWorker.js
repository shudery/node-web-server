//应用集群扩展

const cluster = require('cluster');
function startWorker(){
	let worker = cluster.fork();
	console.log(`CLUSTER:worker ${worker.id} strated`);
}
if(cluster.isMaster){
	require('os').cpus().forEach(()=>{
		startWorker();
	})
	cluster.on('disconnect',(worker)=>{
		console.log(`CLUSTER:worker ${worker.id} disconnected`);
	});
	cluster.on('exit',(worker)=>{
		console.log(`CLUSTER:worker ${worker.id} dead`);
		startWorker();
	})
}else{
	require('app.js')();
}