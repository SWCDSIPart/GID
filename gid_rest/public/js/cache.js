var cache = new Map();

exports.get = function(key) {
	return cache.get(key);
};

exports.set = function(key, value){
	return cache.set(key,value);
};

exports.size = function(){
	return cache.size;
}
