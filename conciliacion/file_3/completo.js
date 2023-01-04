const fs = require('fs')
const path = require('path')
const {ExecuteFetch} = require('../../common/node-fetch')
const csv = require("csv-stringify");

const init =async ()=>{
    try{
        const thisPath = './conciliacion/file_3/'

        //ficheros de pago que dio julito
        const file_3 = require('../../mapper/file_3')
        const file_4 = require('../../mapper/file_4')
        const file_7 = require('../../mapper/file_7')
        const file_8 = require('../../mapper/file_8')

        // const completoEtecsa = file_3.concat(file_4).concat(file_7).concat(file_8)

        const enEtecsaNoEnGuajiritoGuardar = []

        const metodo = async (arr, text) =>{
            for(let i = 3658; i < arr.length; i++){
                let item = arr[i]
                if(item['id tercero'].startsWith('TIE')){
                    const headers = {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Accept-Charset': 'utf-8',
                        Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJrcmxvc25vdGlmaWNhdGlvbnMxMDE5OTRAZ21haWwuY29tIiwibGFzdExvZ291dCI6IjIwMjMtMDEtMDNUMjI6Mzc6MzkuMDAwWiIsImRhdGUiOiIyMDIzLTAxLTAzVDIyOjQ4OjAwLjM4N1oiLCJjcmVhdGVkQXQiOiIyMDIxLTA3LTI3VDA0OjA1OjIxLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAxLTAzVDIyOjM3OjM5LjAwMFoiLCJyYW5kb20iOjAuMTYxODk5MzA1NzE4NTczMTR9LCJpYXQiOjE2NzI3ODYwODAsImV4cCI6MTY3MjgyMjA4MH0.S1y184Zq-U49fXPsxrkDu1RVBmVqCY3zjcamErRkSxQ'
                    };
        
                    const options = {
                        method: 'get',
                        headers: headers,
                    };
        
        
                    const payment = await ExecuteFetch(`https://api.tiendascaracol.com/v1/admin/payment?limit=10&offset=0&order=-createdAt&filter%5B$and%5D%5Border%5D%5B$like%5D=%25${item['id tercero']}%25`,options)
                    enEtecsaNoEnGuajiritoGuardar.push({
                        index:i,
                        estado: payment.body.data[0]?.status,
                        codigo: item['id tercero'],
                        esta: payment.body.data.length?'si':'no',
                        valorGuajiritos: payment.body.data[0]?.amount,
                        valorEtecsa: item.Importe,
                        fecha: item.DATE,
                        business: payment.body.data[0]?.Business.name,
                        // Guajiritos: payment.body.data
                    })
        
                    console.log(`${text} ${i}/${arr.length}`)
                    
                    // (C) CREATE CSV FILE
                    csv.stringify(enEtecsaNoEnGuajiritoGuardar, {
                        header : true,
                        columns : { 
                            index: 'numero',
                            codigo: 'codigo',
                            valorEtecsa: 'valor etecsa',
                            fecha: 'fecha',
                            
                            esta: 'esta en guaj',
        
                            estado: 'estado en guaj',
                            
                            valorGuajiritos: 'valor en guaj',
                            business:'Tienda'
                        }
                    }, (err, output) => {
                        fs.writeFileSync(path.resolve(thisPath,`./${text}-3658.csv`), output);
                    });
                    // fs.writeFileSync(path.resolve(thisPath,'./enEtecsaNoEnGuajirito2.json'), JSON.stringify(enEtecsaNoEnGuajiritoGuardar));
                }
            }
        }
        
        // await metodo (file_3, 'file_3')
        // await metodo (file_4, 'file_4')
        await metodo (file_7, 'file_7')
        // await metodo (file_8, 'file_8')
    } catch(e) {
        console.log(e)
    }   
}

init()