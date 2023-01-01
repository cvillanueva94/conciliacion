const fs = require('fs')
const path = require('path')

const thisPath = './conciliacion/file_2/'

//ficheros de pago que dio julito
const file_3 = require('../../mapper/file_3')
const file_4 = require('../../mapper/file_4')

//ficheros del sistema de mibulevar
const file_6 = require('../../mapper/file_6')

const firstDay = new Date('10/01/2022')
const lastDay = new Date('10/31/2022')

const compare = (item, firstDay, lastDay, type) => {
    if(type===1){
        item.DATE = `11/${item.fecha.split(' ')[0]}/2022`
    }
    const day = new Date(item.DATE)
    let validate = day >= firstDay && day <= lastDay
    if(type===1)
        validate = day >= firstDay && day < lastDay
    return  validate && (type===1? item.Orden.startsWith('TPE'): item['id tercero'].startsWith('TPE'))
}

const reduce = (a, b) => {
    return parseFloat(a) + parseFloat(b)
}

const file_3_octubre = file_3.filter(item => compare(item, firstDay, lastDay) )
const file_4_octubre = file_4.filter(item => compare(item, firstDay, lastDay) )

const octubreCompletoEtecsa = file_3_octubre.concat(file_4_octubre)
const octubreEtecsa = octubreCompletoEtecsa.map(item => item['id tercero'])
const octubreGuajirito = file_6.map(item => item.Orden)

const totalDeMonto = octubreCompletoEtecsa.map(item=>item.Importe).reduce((a, b) => {
    return parseFloat(a) + parseFloat(b)
}, 0);

const difference = (a, b) => a.filter(x => !b.includes(x));

const enEtecsaNoEnGuajirito = difference (octubreEtecsa, octubreGuajirito)
const enGuajiritoEnEtecsaNo = difference (octubreGuajirito, octubreEtecsa)


const enEtecsaNoEnGuajiritoDatos = enEtecsaNoEnGuajirito.map(item =>{
    let data = octubreCompletoEtecsa.filter(itemX => item===itemX['id tercero'])
    if(data.length===1)
        data = data[0]
    return data
})

//Resumen diario

const resumenDiario = (result, data, type)=>{
    for(let i = 1; i < 32; i++) {
        const startDay = new Date(`10/${i}/2022`)
        const endDay = new Date(`10/${i+1}/2022`)
        const dia = data.filter(item => compare(item, startDay, endDay, type))

        result[i] = {
            cantidadTotal: dia.length,
            datos: dia,
            sumaTotal: (dia.map(item => type === 0 ? item.Importe : item.Precio ).reduce((a,b)=>reduce(a,b),0)).toFixed(2)
        }
    }
}

const diarioEtecsa = {}
resumenDiario(diarioEtecsa, octubreCompletoEtecsa, 0)

const diarioGuajiritos = {}
resumenDiario(diarioGuajiritos, file_6, 1)



//Resumen diario

fs.cwriteFileSync(path.resolve(thisPath,'./enEtecsaNoEnGuajirito.json'), JSON.stringify(enEtecsaNoEnGuajirito));
fs.writeFileSync(path.resolve(thisPath, `./enGuajiritoEnEtecsaNo.json`), JSON.stringify(enGuajiritoEnEtecsaNo));