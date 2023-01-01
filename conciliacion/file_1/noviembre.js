const fs = require('fs')
const path = require('path')
const {ExecuteFetch} = require('../../common/node-fetch')

const init = async () => {
    try{
        const thisPath = './conciliacion/file_1/'
        //ficheros de pago que dio julito
        const file_3 = require('../../mapper/file_3')
        const file_4 = require('../../mapper/file_4')

        //ficheros del sistema de mibulevar
        const file_5 = require('../../mapper/file_5')

        const firstDay = new Date('11/01/2022')
        const lastDay = new Date('11/30/2022')

        const compare = (item, firstDay, lastDay, type) => {
            if(type===1){
                item.DATE = `11/${item.fecha.split(' ')[0]}/2022`
            }
            const day = new Date(item.DATE)
            let validate = day >= firstDay && day <= lastDay
            if(type === 1) validate = day >= firstDay && day < lastDay
            return  validate && (type===1? item.Orden.startsWith('TPE'): item['id tercero'].startsWith('TPE'))
        }

        const reduce = (a, b) => {
            return parseFloat(a) + parseFloat(b)
        }

        const file_3_noviembre = file_3.filter(item => compare(item, firstDay, lastDay) )
        const file_4_noviembre = file_4.filter(item => compare(item, firstDay, lastDay) )

        const noviembreCompletoEtecsa = file_3_noviembre.concat(file_4_noviembre)
        const noviembreEtecsa = noviembreCompletoEtecsa.map(item => item['id tercero'])
        const noviembreGuajirito = file_5.map(item => item.Orden)

        const totalDeMonto = noviembreCompletoEtecsa.map(item=>item.Importe).reduce((a, b) => {
            return parseFloat(a) + parseFloat(b)
        }, 0);

        const difference = (a, b) => a.filter(x => !b.includes(x));

        const enEtecsaNoEnGuajirito = difference (noviembreEtecsa, noviembreGuajirito)
        const enGuajiritoEnEtecsaNo = difference (noviembreGuajirito, noviembreEtecsa)


        const enEtecsaNoEnGuajiritoDatos = enEtecsaNoEnGuajirito.map(item =>{
            let data = noviembreCompletoEtecsa.filter(itemX => item===itemX['id tercero'])
            if(data.length===1)
            data = data[0]
            return data
        })

        //Resumen diario

        const resumenDiario = (result, data, type)=>{
            for(let i = 1; i < 32; i++) {
                const startDay = new Date(`11/${i}/2022`)
                const endDay = new Date(`11/${i+1}/2022`)
                const dia = data.filter(item => compare(item, startDay, endDay, type))

                result[i] = {
                    cantidadTotal: dia.length,
                    datos: dia,
                    sumaTotal: (dia.map(item => type===0?item.Importe:item.Precio ).reduce((a,b)=>reduce(a,b),0)).toFixed(2)
                }
            }
        }

        const diarioEtecsa = {}
        resumenDiario(diarioEtecsa, noviembreCompletoEtecsa, 0)

        const diarioGuajiritos = {}
        resumenDiario(diarioGuajiritos, file_5, 1)



        //Resumen diario


        //busqueda de sistema

    const enEtecsaNoEnGuajiritoGuardar=[]
        for(const item of enEtecsaNoEnGuajiritoDatos){

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
                estado: payment.body.data[0]?.status,
                codigo: item['id tercero'],
                esta: payment.body.data.length?'si':'no',
                valorGuajiritos: payment.body.data[0]?.amount,
                valorEtecsa: item.Importe,
                fecha: item.DATE
            })
        }

        //busqueda de sistema

        fs.writeFileSync(path.resolve(thisPath,'./enEtecsaNoEnGuajirito.json'), JSON.stringify(enEtecsaNoEnGuajiritoGuardar));
        fs.writeFileSync(path.resolve(thisPath, `./enGuajiritoEnEtecsaNo.json`), JSON.stringify(enGuajiritoEnEtecsaNo));
    } catch(e) {
        console.log(e)
    }
}

init()