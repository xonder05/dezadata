import './App.css';
import { useState } from 'react';
import { useRef } from 'react';
import { XMLParser } from 'fast-xml-parser';

/**
 * Renders button for file input. On change reads file, parses xml using third-party module and saves structured data into two persistent variables (which triggers refresh of the page content).
 */
function Selector({ setSales, setModels }) 
{
    const hiddenFileInput = useRef(null);
  
    function handleClick(event) 
    {
        hiddenFileInput.current.click();
    }

    function handleFile(event)
    {
        const file = event.target.files[0];

        const reader = new FileReader();
        
        reader.onload = () => {

            const parser = new XMLParser();
            let fileAsJson = parser.parse(reader.result);

            let models = {}
            for (let model of fileAsJson.models.car) {
                models[model.name] = {price: model.price, dph: model.dph}
            }
            setModels(models)

            let sales = []
            for (let sale of fileAsJson.sales.sale) {
                sales.push({modelName: sale.model_name, date: new Date(Date.parse(sale.date))})
            }
            setSales(sales)
        };
        
        reader.readAsText(file);
    }

    return (
        <div>
            <button onClick={handleClick}>Upload a file</button>
            <input type="file" onChange={handleFile} ref={hiddenFileInput} style={{display: 'none'}}/>    
        </div>
    )
}

/**
 * Creates table containing the input data.
 */
function InputTable({ models, sales }) 
{
    return (
        <table>
            <tr className='row'>
                <th>Model</th>
                <th>Datum prodeje</th>
                <th>Cena</th>
                <th>DPH</th>
            </tr>

            {sales.map((sale) => {
                return (
                    <tr className='row'>
                        <td>{sale.modelName}</td>
                        <td>{sale.date.getDate() + "." + (sale.date.getMonth() + 1) + "." + sale.date.getFullYear()}</td>
                        <td>{models[sale.modelName].price + "Kč"}</td>
                        <td>{models[sale.modelName].dph + "%"}</td>
                    </tr>
                )
            })}
        </table>
    )
}

/**
 * Creates multiple tables, each containing aggregated data from single week.
 */
// function AggregatedTablePerWeek({ models, sales}) 
// {
//     function getWeekStart(date) {
//         let weekStart = new Date(date.valueOf())
//         weekStart.setDate(date.getDate() - date.getDay()) 
//         return weekStart
//     }

//     let weeks = {}

//     for (let sale of sales)
//     {
//         let weekStart = getWeekStart(sale.date)

//         if (weekStart in weeks && sale.modelName in weeks[weekStart]) 
//         {
//             weeks[weekStart][sale.modelName] += models[sale.modelName].price
//         }
//         else 
//         {
//             if (!(weekStart in weeks)) {
//                 weeks[weekStart] = {}
//             }

//             weeks[weekStart][sale.modelName] = models[sale.modelName].price
//         }
//     }

//     return (
//     <div>
//         {Object.entries(weeks).map(([date, model]) => {
//             return (
//                 <table>
//                     <tr>
//                         <th colSpan="2">{date}</th>
//                     </tr>
//                     {Object.entries(model).map(([modelName, price]) => {
//                         return (<>
//                             <tr>
//                                 <td colSpan="2">{modelName}</td>
//                             </tr> 
//                             <tr>
//                                 <td>{price + "Kč"}</td>
//                                 <td>{price * (1 + models[modelName].dph / 100) + "Kč"}</td>
//                             </tr>
//                         </>)
//                     })}
//                 </table>
//             )
//         })}
//     </div>
//     )
// }

/**
 * Creates single table containing aggregated data from all weekends.
 */
function AggregatedTableWeekdays({ models, sales}) 
{
    function wasWeekend (date) 
    {
        if (date.getDay() === 0 || date.getDay() === 6) {
            return true
        }
        else {
            return false
        }
    }

    let aggregated = {}

    for (let sale of sales)
    {
        if (wasWeekend(sale.date))
        {
            if (!(sale.modelName in aggregated)) {
                aggregated[sale.modelName] = models[sale.modelName].price
            }
            else {
                aggregated[sale.modelName] += models[sale.modelName].price
            }

        }
    }

    return (
        <table>
            <tr>
                <th colSpan="2">Model</th>
            </tr> 
            <tr>
                <th>Cena bez DPH</th>
                <th>Cena s DPH</th>
            </tr>
            
            {Object.entries(aggregated).map(([modelName, price]) => {
                return (<>
                    <tr>
                        <td colSpan="2">{modelName}</td>
                    </tr> 
                    <tr>
                        <td>{price + "Kč"}</td>
                        <td>{price * (1 + models[modelName].dph / 100) + "Kč"}</td>
                    </tr>
                </>)
            })}
        </table>
    )
}

/**
 * Main, holds persistent data 
 */
function App() 
{
    const [models, setModels] = useState({});
    const [sales, setSales] = useState([]);

    if (Object.keys(models).length === 0 && sales.length === 0)
    {
        return (
            <div id='page'>
                <Selector setModels={setModels} setSales={setSales}/>
            </div>
        )
    }
    else 
    {
        return (
            <div id='page'>
                <Selector setModels={setModels} setSales={setSales}/>
                
                <h2>Vstupní data</h2>
                <InputTable models={models} sales={sales}/>
                
                <h2>Agregované prodeje</h2>
                <AggregatedTableWeekdays models={models} sales={sales}/>
                {/* <AggregatedTablePerWeek models={models} sales={sales}/> */}
            </div>
        )
    }
}

export default App;
