var sum_to_n_a = function(n) {
    var sum = 0;
    for (let i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    return (n*(n+1))/2
};

var sum_to_n_c = function(n) {
    var sum = 0;
    var i = 0;
    while (i<=n) {
        sum+= i;
        i++
    }
    return sum;
};

console.log(sum_to_n_a(5)); 
console.log(sum_to_n_b(5)); 
console.log(sum_to_n_c(5)); 