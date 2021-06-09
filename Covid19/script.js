var ctx = document.getElementById('myChart').getContext('2d');

const list=document.getElementById('side');

let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        title:{
            display:true,
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

let htReq=new XMLHttpRequest();
htReq.open('GET','https://api.covid19api.com/countries',true);


function listClicked(e){
    let htReq=new XMLHttpRequest();
    htReq.open('GET','https://api.covid19api.com/dayone/country/'+e.target,true);

}

htReq.onload = function(){
    if(this.status==200){
        var countries=JSON.parse(this.response);
        var trier=countries.sort((a,b)=>a.Country<b.Country?-1:1);
        var str='<ul>';
        let i;
        for (i in countries){
            str+='<li class="country">'+trier[i].Country+'</li>'
        }
        list.innerHTML=str+'</ul>';
        document.querySelectorAll('.country').forEach(item => {
            item.addEventListener('click', e => {
                let a=item.innerHTML;
            let htpReq=new XMLHttpRequest();
            htpReq.open('GET','https://api.covid19api.com/dayone/country/'+item.innerHTML);
            htpReq.onreadystatechange=function(){
                if(htpReq.status==200 && htpReq.readyState==4){
                    let raw=JSON.parse(this.response)
                    let confirmed=raw.map(e=>e.Confirmed);
                    let activ=raw.map(e=>e.Active);
                    console.log(activ);
                    let days=raw.map(e=>{
                        let d=new Date(e.Date);
                        let day=d.getDate();
                        let month=d.getMonth();
                        let year=d.getFullYear();
                        return `${day}/${month+1}/${year}`
                        
                    });
                    let recovered=raw.map(e=>e.Recovered);
                    let dead=raw.map(e=>e.Deaths)
                    let datasets=[{
                        label:'confirmed',
                        data:confirmed,
                        borderColor:'yellow'
                    },{
                        label:'recovered',
                        data:recovered,
                        borderColor:'green'
                    },{
                        label:'dead',
                        data:dead,
                        borderColor:'red'
                    },{
                        label:'active',
                        data:activ,
                        borderColor:'purple'
                    }];
                    

                    myChart.data.labels=days;
                    myChart.data.datasets=datasets;
                    myChart.update();
                    document.getElementById('countName').innerHTML=a;
                }
            }
            htpReq.send();
            })
          })
    }
}
htReq.send();