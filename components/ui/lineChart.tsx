'use client'
import React,{useEffect, useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

interface Props {
  metadata: any;
}

function convertDataFormat(chart_data: any): any {
  console.log('called')
  const labels: string[] = [];
  const datasets: any[] = [];

  for (const key in chart_data) {
    
    const color = generateRandomRGB();
    const dataset = {
      label: key,
      data: [] as number[],
      borderColor: color,
      backgroundColor: color,
    };

    for (const subKey in chart_data[key]) {
      const num = parseNumber(chart_data[key][subKey])
      if(labels.length < Object.keys(chart_data[key]).length){
        labels.push(subKey);
      }
      
      dataset.data.push(num);
      
      
    }

    datasets.push(dataset);
  }

  return {
    labels,
    datasets,
  };
}

function parseNumber(value: string): number {
  // Remove commas and parse the number
  return parseInt(value.replace(/,/g, ''), 10);
}

function generateRandomRGB(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
}

function generateRandomRGBA(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const alpha = Math.random();

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}



const LineChart : React.FC<Props> = (props: Props)=> {

  const [dataIndex,setDataIndex] = useState(0);
  const [displayData,setDisplayData] = useState({labels:[],datasets:[]});
  const [allData,setAllData] = useState({labels:[],datasets:[]});


  useEffect(() => {
    const data = JSON.parse(props.metadata.data);

    const convertedData = convertDataFormat(data);
    setAllData(convertedData);
    setDisplayData(convertedData)
  }, [props.metadata])

  const handleClick = (index: number) => {
    setDisplayData((prevData: any) => {
      let newData = {...prevData};
      newData.datasets = [allData.datasets[index]];
      console.log(newData)
      return newData;
    })
    setDataIndex(index);
  }
  
  

  options.plugins.title.text =  props.metadata.title || ( `${props.metadata?.text.match(/Ticker: (.*)/)?.[1]} ` + (props.metadata?.text.match(/DATA:(.*)/)?.[1] || props.metadata?.text.match(/DATA: (.*)/)?.[1]))

  return (
    <>
        
        <div className='flex mt-2'>
        <div className=''>View: </div> 

        <div className='overflow-x-auto w-full flex pb-3'>
        <button 
              onClick={()=>setDisplayData(allData)} 
              className={` hover:bg-sky-400/10 ${dataIndex===0?'bg-sky-400/20':''} text-sky-400 p-1 cursor-pointer rounded border-solid border border-sky-500 whitespace-nowrap ml-2`} >
              Combined
            </button>
          {allData.datasets.map((key:any, index) => (
            <button 
              onClick={()=>handleClick(index+1)} // 1 based indexing in Array , 0 is for all
              className={` hover:bg-sky-400/10 ${dataIndex===index+1?'bg-sky-400/20':''} text-sky-400 p-1 cursor-pointer rounded border-solid border border-sky-500 whitespace-nowrap ml-2`} key={index}>
              {key.label}
            </button>
          ))}
        </div>
        </div>

        <Line options={options} data={displayData} />

    </>
    
  )
}

LineChart.displayName = 'LineChart';

export default LineChart