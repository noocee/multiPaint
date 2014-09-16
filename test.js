/**
 * Created by nodefx on 9/15/14.
 */


var arr = [];
arr['s'] = 'ss';
arr['a'] = 'aa';
arr['b'] = 'bb'

function del(arr, str){
    var i = 0;
    for(var index in arr){
        if(index == str){
            arr.splice(i, 1);
        }
        i += 1;
    }
}

//del(arr, 's')
delete arr['s']

console.log(arr)

