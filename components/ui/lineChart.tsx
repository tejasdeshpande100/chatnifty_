import React from 'react';
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

  console.log('props', props)

  const data = JSON.parse(props.metadata.data);
 
  const convertedData = convertDataFormat(data);
  console.log('convertedData', convertedData)

  options.plugins.title.text =  props.metadata.title || ( `${props.metadata?.text.match(/Ticker: (.*)/)?.[1]} ` + (props.metadata?.text.match(/DATA:(.*)/)?.[1] || props.metadata?.text.match(/DATA: (.*)/)?.[1]))

  return (
    <>
        <Line options={options} data={convertedData} />
    </>
    
  )
}

LineChart.displayName = 'LineChart';

export default LineChart