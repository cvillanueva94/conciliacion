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

        const completoEtecsa = file_3.concat(file_4).concat(file_7).concat(file_8)

        const enEtecsaNoEnGuajiritoGuardar = []
        for(let i = 0; i < completoEtecsa.length; i++){
            let item =completoEtecsa[i]
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Charset': 'utf-8',
                Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwibGFzdExvZ291dCI6IjIwMjItMTItMjZUMTU6MTI6NTUuMDAwWiIsImRhdGUiOiIyMDIzLTAxLTAxVDE4OjM2OjM1LjgwMloiLCJjcmVhdGVkQXQiOiIyMDIxLTA5LTEzVDAxOjQ0OjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTEyLTI2VDE1OjEyOjU1LjAwMFoiLCJyYW5kb20iOjAuNTY2ODEzMDU3OTg1MzA2Nn0sImlhdCI6MTY3MjU5ODE5NSwiZXhwIjoxNjcyNjM0MTk1fQ.F8xqyhX9psiN-ZmrljlQddu3IrAm-qjKJCRAVMbKa_s'
            };

            const options = {
                method: 'get',
                headers: headers,
            };


            const payment = await ExecuteFetch(`https://api.mibulevar.com/v1/admin/payment?limit=10&offset=0&order=-createdAt&filter%5B$and%5D%5Border%5D%5B$like%5D=%25${item['id tercero']}%25`,options)
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

            console.log(`${i}/${completoEtecsa.length}`)
            
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
                fs.writeFileSync(path.resolve(thisPath,'./enEtecsaNoEnGuajirito2.csv'), output);
            });
            // fs.writeFileSync(path.resolve(thisPath,'./enEtecsaNoEnGuajirito2.json'), JSON.stringify(enEtecsaNoEnGuajiritoGuardar));
        }
    } catch(e) {
        console.log(e)
    }   
}

init()