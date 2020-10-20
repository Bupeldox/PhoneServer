# PhoneServer
Hi, how u doing
I cba to do shit on my phone so hopefully git solves this



## Create bin
```
$.ajax({
    url: '/bin/create/'+SuperSecretKey,
    type: 'POST',
    contentType: 'application/json',
    success: function(response){
        var data = JSON.parse(response);
        var binId = data.BinId;//Don't loose this pls
    }
});
```
## AddTo bin
```
$.ajax({
    url: '/bin/'+binId,
    type: 'POST',
    data:JSON.stringify(postitToAdd),
    contentType: 'application/json',
    success: function(response){
        console.log(JSON.stringify(response));
    }
});
```


## Get bin
```
$.ajax({
    url: '/bin/'+binId,
    type: 'GET',
    contentType: 'application/json',
    success: function(response){
        DrawPostits(response.data);
    }
});
```

