import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
import OutlinedInput from '@mui/material/OutlinedInput';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import { Select, MenuItem, FormControl, InputLabel, FormControlLabel, Switch, Stack, Typography, Skeleton, IconButton, Avatar, ListItemIcon, CircularProgress } from '@mui/material';
import { ListItemText } from '@mui/material';
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
import AlertModal from './AlertModal';
import { createModel, evaluatePredictions, fitModel, predictWithModel, trainTestSplitData, getConfusionMatrix, plotConfusionMatrix, saveDataframe, savePickle, downloadFileFromPath } from '../AllAssets';
import SavedProgressTop from './SavedProgressTop';
import LabelAndSplit from './LabelAndSplit';
import { styled } from '@mui/material/styles';
import { AxiosResponse } from 'axios';
// import { PieChart, Pie, Sector, Tooltip as ToolTip } from "recharts";
// import { Cell, ResponsiveContainer, Label } from 'recharts';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chart, { ChartConfiguration, ChartOptions } from 'chart.js/auto';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
// import { PDFDocument, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
interface PieChartProps {
  data: { labels: string[]; values: number[] };
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, height = 400 }) => {
  const chartContainer = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<'pie'>>();

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      if (chartInstance.current) {
        // Destroy previous chart instance
        chartInstance.current.destroy();
      }
      const ctx = chartContainer.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            // labels: data.labels.map((label, index) => `${label} (${data.values[index]}%)`),
            labels: data.labels.map(label => `${label} (%)`),
            datasets: [
              {
                // label: 'Pie Chart',
                data: data.values,
                backgroundColor: [
                  '#006458',
                  '#B44051',
                ],
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            height: height,
          },
        } as ChartConfiguration<'pie'>);
      }
    }
  }, [data, height]);

  return <canvas ref={chartContainer} />;
}


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};


const SelectModel = () => {

  const divRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: any, index: React.SetStateAction<number>) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const navigate = useNavigate();
  const navigateTo = (route: any) => {
    navigate(route);
  }

  const responseChecker = (response: AxiosResponse<any, any>) => {
    if (response.status == 400) {
      toastMessage('error', 'Invalid Request!');
      return false;
    }
    else if (response.status == 500) {
      toastMessage('error', "Server Issue");
      return false;
    }
    else if (response.status == 200 || response.status == 201) {
      if (response.data['status'] == "success") {
        console.log(response);
        return true;
      }
      else if (response.data['status'] == "failure") {
        toastMessage('error', response.data['message']);
        return false;
      }
    }
  }



  const toastMessage = (value: string, message: string) => {
    // success
    // error
    // warning
    // info
    if (value == "success") {
      toast.success(message);
    }
    else if (value == "error") {
      toast.error(message);
    }
    else if (value == "warning") {
      toast.warning(message);
    }
    else if (value == "info") {
      toast.info(message);
    }
  };

  useEffect(() => {
    // Function to run once when component mounts
    // const getModels = async () => {
    //   try {
    //     const response = await getAvailableModelsList();
    //     const responseData = response.data.data;
    //     setOptionsForModels(responseData);

    //   } catch (error: any) {
    //     toastMessage('error', error);
    //     console.error(error);
    //   }
    // };

    // getModels();
  }, []);


  // FOR MODEL SELECT DROPDOWN AND SELECTION
  const [optionsForModels, setOptionsForModels] = useState<any[]>([
    { value: 'logistic_regression', name: 'Logistic Regression' },
    { value: 'decision_tree_classifier', name: 'Decision Tree Classifier' },
    { value: 'random_forest_classifier', name: 'Random Forest Classifier' },
    { value: 'svc', name: 'SVC' },
    { value: 'kneighbors_classifier', name: 'Kneighbors Classifier' },
    { value: 'gradient_boosting_classifier', name: 'Gradient Boosting Classifier' },
    { value: 'mlp_classifier', name: 'MLP Classifier' },
    { value: 'gaussian_nb', name: 'Gaussian NB' },
  ]);

  const [selectedModel, setSelectedModel] = useState<any>();
  const [predictionMetrics, setPredictionMetrics] = useState<any>();
  const [modelTrainingCurrent, setModelTrainingCurrent] = useState<any>(false);

  const handleChangeInModel: any = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedOption = optionsForModels.find(option => option.name == event.target.value);
    setSelectedModel(selectedOption || { value: '', name: '' });
    // setSelectedModel(event.target.value as string);
  };

  const renderOption: any = (option: any) => (
    <React.Fragment>
      <ListItemText primary={option.name} />
    </React.Fragment>
  );


  // ALERT DIALOG BOX 
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogForSplitAndLabel, setOpenDialogForSplitAndLabel] = useState<boolean>(false);
  const [alertMessageContent, setAlertMessageContent] = useState<string>("");
  const [alertMessageContentForSplitAndLabel, setAlertMessageContentForSplitAndLabel] = useState<string>("");

  const onTrainBtnClicked = () => {
    if (!selectedModel || selectedModel?.name == '') {
      toastMessage('error', 'Please select a model!');
    }
    else {
      setAlertMessageContent("Are you sure you want to train the model using " + selectedModel?.name + "?")
      handleClickOpenDialog();
    }
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleClickOpenDialogForSplitAndLabel = () => {
    setAlertMessageContentForSplitAndLabel(selectedModel?.name);
    setOpenDialogForSplitAndLabel(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogForSplitAndLabel = () => {
    setOpenDialogForSplitAndLabel(false);
  };

  const handleYesDialog = () => {
    toastMessage('info', 'Please fill details!');
    handleCloseDialog();
    handleClickOpenDialogForSplitAndLabel();
  };

  const [imageData, setImageData] = useState<string>('');

  const plotConfusion_Matrix = async (labelColumn: any) => {
    try {
      const response = await plotConfusionMatrix(labelColumn.label);
      console.log("plotConfusionMatrix", response);
      if (responseChecker(response))
        return true;
      else
        return false;
    } catch (error: any) {
      toastMessage('error', 'Error plotting confusion matrix!');
      return false;
    }
  }
  const getConfusion_Matrix = async (labelColumn: any) => {
    if (await plotConfusion_Matrix(labelColumn)) {
      try {
        const response = await getConfusionMatrix();
        console.log("response confusion", response)
        console.log("getConfusionMatrix", response);
        const base64Data = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );

        const imageUrl = `data:${response.headers['content-type']};base64,${response.data.data.image}`;
        console.log("imageeeurl", response);
        setImageData(imageUrl);
      } catch (error: any) {
        toastMessage('error', 'Error fetching confusion matrix!');
      }
    }


  }

  const trainAndTest_Split = async (labelColumn: any, secondValue: any) => {
    try {
      setModelTrainingCurrent(true);
      const trainTestResponse = await trainTestSplitData([labelColumn.label], secondValue / 100);
      if (responseChecker(trainTestResponse))
        return true;
      else
        return false;
    } catch (error: any) {
      setModelTrainingCurrent(false);
      toastMessage('error', 'Error splitting train and test data!');
      return false;
    }
  }

  const create_Model = async () => {
    try {
      const createModelResponse = await createModel(selectedModel?.value);
      if (responseChecker(createModelResponse))
        return true;
      else
        return false;
    } catch (error: any) {
      toastMessage('error', 'Error creating model!');
      return false;
    }
  }

  const fit__Model = async () => {
    try {
      const fit_model = await fitModel();
      if (responseChecker(fit_model))
        return true;
      else
        return false;
    } catch (error: any) {
      toastMessage('error', 'Error fitting model!');
      return false;
    }
  }

  const predictWith_Model = async () => {
    try {
      const predictWithModelResponse = await predictWithModel();
      if (responseChecker(predictWithModelResponse))
        return true;
      else
        return false;
    } catch (error: any) {
      toastMessage('error', 'Error predicting model with response!');
      return false;
    }
  }

  const evaluate_PredictionsResponse = async (label_Column: any, test_Value: any) => {
    try {
      const evaluatePredictionsResponse = await evaluatePredictions();
      if (responseChecker(evaluatePredictionsResponse)) {
        const accuracyP: any = (evaluatePredictionsResponse.data.data.metrics.Accuracy * 100).toFixed(2);
        setAccuracyPercent(accuracyP);

        let predictionMetrics: any = evaluatePredictionsResponse.data.data.metrics;
        predictionMetrics['Model Name'] = selectedModel?.name;
        predictionMetrics['testValue'] = test_Value;
        predictionMetrics['labelColumn_label'] = label_Column['label']
        predictionMetrics['labelColumn_columnType'] = label_Column['columnType']
        setPredictionMetrics(predictionMetrics);
        console.log("accuracyP", accuracyP);

        let accuracyChart: any = (evaluatePredictionsResponse.data.data.metrics.Accuracy * 100).toFixed(2);
        let inAccuracyChart: any = (100 - accuracyChart).toFixed(2);
        setChartDataPie([
          { name: "Efficient", value: accuracyChart },
          { name: "Inefficient", value: inAccuracyChart },
        ]);
        console.log([
          { name: "Efficient", value: accuracyChart },
          { name: "Inefficient", value: inAccuracyChart },
        ])
        console.log("evaluatePredictionsResponse", evaluatePredictionsResponse.data.data.metrics);
        setModelTrainingCurrent(false);
        return true;
      }
      else
        return false;
    } catch (error: any) {
      toastMessage('error', 'Error evaluating predictions!');
      return false;
    }
  }


  const handleYesDialogForSplitAndLabel = async (labelColumn: any, secondValue: any) => {
    console.log('labelColumn', labelColumn);
    console.log('secondValue', secondValue);
    toastMessage('info', 'Your model will be trained accordingly!');
    console.log(selectedModel?.value);
    if (await trainAndTest_Split(labelColumn, secondValue)) {
      if (await create_Model()) {
        if (await fit__Model()) {
          if (await predictWith_Model()) {

            setChartDataPie([]);
            setIsChartLoading(1);
            evaluate_PredictionsResponse(labelColumn, secondValue);
            changeCurrProgressState(true);
            getConfusion_Matrix(labelColumn);
          }
        }
      }
    }
    handleCloseDialogForSplitAndLabel();
  };


  const handleNoDialog = () => {
    toastMessage('warning', 'No changes made!');
    handleCloseDialog();
  };

  const handleNoDialogForSplitAndLabel = () => {
    toastMessage('warning', 'No changes made!');
    handleCloseDialogForSplitAndLabel();
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#aab4be',
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: '#C2518E',
          width: 32,
          height: 32,
          // '&::before': {
          //   content: "'R'",
          //   position: 'absolute',
          //   width: '100%',
          //   height: '100%',
          //   left: 0,
          //   top: 0,
          //   backgroundRepeat: 'no-repeat',
          //   backgroundPosition: 'center',
          // },
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#00598D',
      width: 32,
      height: 32,
      // '&::before': {
      //   content: "'C'",
      //   position: 'absolute',
      //   width: '100%',
      //   height: '100%',
      //   left: 0,
      //   top: 0,
      //   backgroundRepeat: 'no-repeat',
      //   backgroundPosition: 'center',
      //   alignItems: 'center',
      //   textAlign: 'center'
      // },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const [switchValue, setSwitchValue] = useState(false);
  const [currSwitchString, setCurrSwitchString] = useState("Classification");

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchValue(event.target.checked);
    if (!event.target.checked) {
      setSelectedModel({ value: '', name: '' });
      setCurrSwitchString("Classification");
      setOptionsForModels([
        { value: 'logistic_regression', name: 'Logistic Regression' },
        { value: 'decision_tree_classifier', name: 'Decision Tree Classifier' },
        { value: 'random_forest_classifier', name: 'Random Forest Classifier' },
        { value: 'svc', name: 'SVC' },
        { value: 'kneighbors_classifier', name: 'Kneighbors Classifier' },
        { value: 'gradient_boosting_classifier', name: 'Gradient Boosting Classifier' },
        { value: 'mlp_classifier', name: 'MLP Classifier' },
        { value: 'gaussian_nb', name: 'Gaussian NB' },])
    }
    else {
      setSelectedModel({ value: '', name: '' });
      setCurrSwitchString("Regression");
      setOptionsForModels([
        { value: 'linear_regression', name: 'Linear Regression' },
        { value: 'decision_tree_regressor', name: 'Decision Tree Regressor' },
        { value: 'random_forest_regressor', name: 'Random Forest Regressor' },
        { value: 'svr', name: 'SVR' },
        { value: 'kneighbors_regressor', name: 'Kneighbors Regressor' },
        { value: 'gradient_boosting_regressor', name: 'Gradient Boosting Regressor' },
        { value: 'mlp_regressor', name: 'MLP Regressor' },])
    }
  };

  const [accuracyPercent, setAccuracyPercent] = useState(80);
  const [isChartLoading, setIsChartLoading] = useState<any>(0);

  const [chartDataPie, setChartDataPie] = useState<any[]>([]);

  const [chartData, setChartData] = React.useState({
    labels: ['NA'],
    values: [100],
  });

  useEffect(() => {
    if (chartDataPie.length >= 2)
      setIsChartLoading(2);
  }, [chartDataPie]);

  useEffect(() => {
    console.log("chartData", chartData);
    setIsChartLoading(0);
    setIsChartLoading(2);
  }, [chartData]);

  useEffect(() => {
    if (predictionMetrics) {
      let accuracy: any = predictionMetrics['Accuracy'] != null ? (predictionMetrics['Accuracy'] * 100).toFixed(2) : 0;
      setChartData({
        labels: ['Accuracy', 'Inaccuracy'],
        values: [accuracy, 100 - accuracy],
      })
    }
  }, [predictionMetrics]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [value, setValue] = React.useState(0);

  // HANDLE CHANGE FOR TAB

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log(newValue);
    if (predictionMetrics) {
      if (newValue == 0) {
        let accuracy: any = predictionMetrics['Accuracy'] != null ? (predictionMetrics['Accuracy'] * 100).toFixed(2) : 0;
        setChartData({
          labels: ['Accuracy', 'Inaccuracy'],
          values: [accuracy, 100 - accuracy],
        })
      }
      else if (newValue == 1) {
        let accuracy: any = predictionMetrics['F1-score'] != null ? (predictionMetrics['F1-score'] * 100).toFixed(2) : 0;
        setChartData({
          labels: ['F1 Score', 'Error Rate'],
          values: [accuracy, 100 - accuracy],
        })
      }
      else if (newValue == 2) {
        let accuracy: any = predictionMetrics['Precision'] != null ? (predictionMetrics['Precision'] * 100).toFixed(2) : 0;
        setChartData({
          labels: ['Precision', 'False Positive Rate (FPR)'],
          values: [accuracy, 100 - accuracy],
        })
      }
      else if (newValue == 3) {
        let accuracy: any = predictionMetrics['Recall'] != null ? (predictionMetrics['Recall'] * 100).toFixed(2) : 0;
        setChartData({
          labels: ['Recall', 'False Negative Rate (FNR)'],
          values: [accuracy, 100 - accuracy],
        })
      }
    }
  };

  // async function generatePDF(divRef: React.RefObject<HTMLDivElement>): Promise<Uint8Array> {
  //   const pdfDoc = await PDFDocument.create();
  //   const page = pdfDoc.addPage();
  //   const { width, height } = page.getSize();
  //   const fontSize = 30;

  //   // Add text content to the PDF
  //   page.drawText('Hello, World!', {
  //     x: 50,
  //     y: height - 4 * fontSize,
  //     size: fontSize,
  //     color: rgb(0, 0, 0),
  //   });

  //   // Capture div content as an image
  //   const divImage = await html2canvas(divRef.current as HTMLElement);

  //   // Add the captured image to the PDF
  //   const image = await pdfDoc.embedPng(divImage.toDataURL());
  //   page.drawImage(image, {
  //     x: 50,
  //     y: height - 200,
  //     width: 200,
  //     height: 100,
  //   });

  //   // Add text above the image
  //   page.drawText('Text above the image', {
  //     x: 50,
  //     y: height - 100,
  //     size: fontSize,
  //     color: rgb(0, 0, 0),
  //   });

  //   return await pdfDoc.save();
  // }

  const centerAlignForPDFXCordinate = (text: any, fontSize: any, margin_for_PDF: any) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
    const XCoordinate = (pageWidth - textWidth) / 2;
    return XCoordinate;
  }

  const rightAlignForPDFXCordinate = (text: any, fontSize: any, margin_for_PDF: any) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
    const XCoordinate = pageWidth - margin_for_PDF - textWidth;
    return XCoordinate;
  }



  const handleDownloadPDF = async () => {
    const pdf = new jsPDF();
    const margin_for_PDF = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();


    let fontSize = 14;
    pdf.setFont('times', 'italic');
    pdf.setFont('times', 'bold');
    pdf.setFontSize(fontSize);

    let firstText = 'Train Details for ' + predictionMetrics['Model Name'];
    pdf.text(firstText, centerAlignForPDFXCordinate(firstText, fontSize, margin_for_PDF), 20);

    pdf.setFont('times', 'normal');
    fontSize = 12;
    pdf.setFontSize(fontSize);

    pdf.text('Validate Data Split: ' + predictionMetrics['testValue'] + '%', margin_for_PDF, 40);

    let textSecondRight = 'Label Column and Type: ' + predictionMetrics['labelColumn_label'] + ' - ' + predictionMetrics['labelColumn_columnType'];
    pdf.text(textSecondRight, rightAlignForPDFXCordinate(textSecondRight, fontSize, margin_for_PDF), 40);

    pdf.text('Accuracy: ' + (predictionMetrics['Accuracy'] * 100).toFixed(2) + '%', margin_for_PDF, 50);

    let thirdSecondRight = 'Recall: ' + (predictionMetrics['Recall'] * 100).toFixed(2) + '%';
    pdf.text(thirdSecondRight, rightAlignForPDFXCordinate(thirdSecondRight, fontSize, margin_for_PDF), 50);

    pdf.text('Precision: ' + (predictionMetrics['Precision'] * 100).toFixed(2) + '%', margin_for_PDF, 60);

    let fourthSecondRight = 'F-1 Score: ' + (predictionMetrics['F1-score'] * 100).toFixed(2) + '%';
    pdf.text(fourthSecondRight, rightAlignForPDFXCordinate(fourthSecondRight, fontSize, margin_for_PDF), 60);

    if (divRef.current) {
      const canvas = await html2canvas(divRef.current);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imageData, 'PNG', margin_for_PDF, 70, pageWidth - margin_for_PDF, 150);
    }


    pdf.save(predictionMetrics['Model Name'] + ' - details.pdf');
  };

  const onDownloadTrainDetails = () => {
    handleDownloadPDF();
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClickDownload = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const openUserMenu = Boolean(anchorEl);
  const handleCloseUserDownload = () => {
    setAnchorEl(null);
  };

  const onDownloadModelClicked = async () => {
    try {
      const response = await saveDataframe(localStorage.getItem('userID'), localStorage.getItem("fileName"));
      if (responseChecker(response))
        downloadFile(response.data['data']['filepath'], '_dataframe')
      // toastMessage('info', response.data['message']);

    } catch (error: any) {
      toastMessage('error', 'Error saving dataframe!');
      return false;
    }
  }

  const onSavePickle = async () => {
    try {
      const response = await savePickle(localStorage.getItem('userID'), localStorage.getItem("fileName"));
      if (responseChecker(response)) {
        downloadFile(response.data['data']['filepath'], '_pickle')
        // toastMessage('info', response.data['message']);
      }

    } catch (error: any) {
      toastMessage('error', 'Error saving model pickle!');
      return false;
    }
  }

  const downloadFile = async (filepath: any, fileNameEnd: any) => {
    try {
      const viewXLSFileResponse = await downloadFileFromPath(localStorage.getItem('userID'), filepath);
      // const viewXLSFileResponse = await getXLSFile(localStorage.getItem('userID'), fileNameRecieved);
      console.log("viewXLSFileResponse", viewXLSFileResponse);
      if (viewXLSFileResponse.data) {
        console.log("viewXLSFileResponse", viewXLSFileResponse);
        // const workbook = XLSX.read(viewXLSFileResponse.data, { type: 'array' });
        // const sheetName = workbook.SheetNames[0];


        const blob = new Blob([viewXLSFileResponse.data], { type: 'application/vnd.ms-excel' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', localStorage.getItem("fileName") + fileNameEnd);
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);


      }
    } catch (error: any) {
      toastMessage('error', 'Error saving model pickle file!');
      console.error(error);
    }
    // try {
    //   const response = await downloadFileFromPath(localStorage.getItem('userID'), filepath);
    //   if (responseChecker(response)) {
    //     // toastMessage('info', response.data['message']);
    //   }
    //   // else {
    //   //   toastMessage('error', response.data['message'])
    //   // }

    // } catch (error: any) {
    //   toastMessage('error', 'Error saving model pickle!');
    //   return false;
    // }
  }

  const changeCurrProgressState = (trainedModel: any) => {
    let tempCurrProgress: any = localStorage.getItem('currentProgress');
    if (tempCurrProgress) {
      if (tempCurrProgress == 'Not Performed pre-processing' || tempCurrProgress == 'Performed pre-processing' || tempCurrProgress == 'Model Train Details Entered') {
        localStorage.setItem('currentProgress', 'Model Trained');
      }
    }
  }

  return (
    <div>
      {modelTrainingCurrent ? (<div>
        <CircularProgress style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '4em',
          height: '4em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white background
          zIndex: 9999
        }} />
      </div>) : (<div></div>)}
      <AlertModal open={openDialog} message={alertMessageContent} handleClose={handleCloseDialog} handleYes={handleYesDialog} handleNo={handleNoDialog} />
      <LabelAndSplit open={openDialogForSplitAndLabel} message={alertMessageContentForSplitAndLabel} handleClose={handleCloseDialogForSplitAndLabel} handleYes={handleYesDialogForSplitAndLabel} handleNo={handleNoDialogForSplitAndLabel} />
      {/* <ToastContainer
        position="top-right"
        theme="light"
        autoClose={5000}
        closeOnClick
        style={{ width: '30em' }}
      /> */}

      <SavedProgressTop />

      <div className='previous-next-btn-bottom'>
        <span className='cursor-pointer' onClick={() => { navigateTo('/activity') }}
        ><NavigateBeforeIcon /> Prev</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* <span className='cursor-pointer' 
          onClick={() => { navigateTo('/selectModel') }}
        >Next <NavigateNextIcon /></span> */}
      </div>

      <div className='p-3' id='1'>
        <div className='row'>
          <div className='col-md-10'>
            <p className='section-heading'>Model Training</p>
          </div>
          <div className='col-md-2 mt-2'>
            <button className='btn visualize-btn' onClick={() => { navigateTo('../explore-data') }}><DataThresholdingIcon />&nbsp; Explore Data</button>
          </div>
        </div>

        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography>
            Classification
          </Typography>
          <MaterialUISwitch
            checked={switchValue} onChange={handleSwitchChange}
          />
          <Typography>
            Regression
          </Typography>
        </Stack>

        <div className='row mt-2'>
          <div className='col-md-10'>
            <FormControl style={{ overflow: 'auto', width: '100%', color: 'black' }}>
              <Select
                displayEmpty
                id="multiple-select-scrollable"
                value={selectedModel?.value}
                onChange={handleChangeInModel}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Please select a {currSwitchString} model </em>;
                  }

                  return selected;
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 225,
                      // width: '100%'
                    },
                  },
                }}
              >
                <MenuItem value='' dense>
                  <em>Select an option</em>
                </MenuItem>
                {optionsForModels.map((option) => (
                  <MenuItem key={option.value} value={option.name} dense>
                    {renderOption(option)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='col-md-2 pe-3'>
            <div className='row'><button onClick={() => onTrainBtnClicked()} className='train-btn btn col-12 p-1 mt-2'><AutoModeOutlinedIcon />&nbsp; Train</button></div>
            {/* <div className='row'><button onClick={() => onTrainBtnClicked()} className='train-btn btn col-12 p-1'><AutoModeOutlinedIcon />&nbsp; Train</button></div> */}
          </div>
        </div>
        <div className='full-page-div'>
          <div className='row ps-2 pe-2'>
            <div className='col-md-12 text-center mt-2' style={{ fontSize: '1.4em', fontStyle: 'italic', color: '#3A4856' }}>
              {
                predictionMetrics ? (<div>
                  Train Details for {predictionMetrics['Model Name']}
                  <Tooltip title="">
                    <span>
                      <IconButton
                        onClick={handleClickDownload}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openUserMenu ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openUserMenu ? 'true' : undefined}
                      >
                        <Avatar
                          sx={{ width: 32, height: 32, backgroundColor: '#0c7bb300', color: 'black' }}>
                          <DownloadIcon />
                        </Avatar>
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openUserMenu}
                        onClose={handleCloseUserDownload}
                        onClick={handleCloseUserDownload}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem
                          onClick={() => { onSavePickle() }}
                        >
                          Save Pickle file
                        </MenuItem>
                        <MenuItem
                          onClick={() => { onDownloadTrainDetails() }}
                        >
                          Download train details
                        </MenuItem>
                        <MenuItem
                          onClick={() => { onDownloadModelClicked() }}
                        >
                          Download dataframe
                        </MenuItem>
                      </Menu>
                      {/* <DownloadIcon style={{ cursor: 'pointer' }} onClick={() => { onDownloadTrainDetails() }} /> */}
                    </span>

                  </Tooltip>
                </div>) : (<div></div>)}
            </div>
            <div className='col-md-6'>
              {isChartLoading == 1 ? (<div>
                <Skeleton variant="circular" width={300} height={300} />
              </div>) : (<div>
                {isChartLoading == 2 ? (

                  <div>
                    {
                      predictionMetrics ? (
                        <div>
                          <div>
                            <Tabs value={value} onChange={handleChange} aria-label="tabs">
                              <Tab label={`Accuracy: ${predictionMetrics['Accuracy'] != null ? (predictionMetrics['Accuracy'] * 100).toFixed(1) : ''}%`} id={`tab-0`} />
                              <Tooltip title={
                                <React.Fragment>
                                  The F1 score is a metric used when dealing with imbalanced datasets. It's the harmonic mean of precision and recall.
                                  <br /><br />
                                  F1 = 2 × <sup>Precision×Recall</sup>&frasl;<sub>Precision+Recall</sub>
                                </React.Fragment>
                              }><Tab label={`F-1 Score: ${predictionMetrics['F1-score'] != null ? (predictionMetrics['F1-score'] * 100).toFixed(1) : ''}%`} id={`tab-1`} /></Tooltip>
                              <Tooltip title={
                                <React.Fragment>
                                  Precision measures the ratio of true positive predictions to the total number of positive predictions made by the model. It focuses on the accuracy of positive predictions.<br /><br />
                                  Precision =  <sup>True Positives</sup>&frasl;<sub>True Positives + False Positives</sub>
                                </React.Fragment>
                              }>
                                <Tab label={`Precision: ${predictionMetrics['Precision'] != null ? (predictionMetrics['Precision'] * 100).toFixed(1) : ''}%`} id={`tab-2`} />
                              </Tooltip>
                              <Tooltip title={
                                <React.Fragment>
                                  Recall, also known as sensitivity, measures the proportion of true positive predictions among all actual positives in the dataset.<br /><br />
                                  Recall =  <sup>True Positives</sup>&frasl;<sub>True Positives + False Negatives</sub>
                                </React.Fragment>
                              }><Tab label={`Recall: ${predictionMetrics['Recall'] != null ? (predictionMetrics['Recall'] * 100).toFixed(1) : ''}%`} id={`tab-3`} /></Tooltip>
                            </Tabs>
                            <TabPanel value={value} index={0}>
                              <div>
                                <PieChart data={chartData} height={10} />
                                {/* <div className='row'>
                                  <div className='col-md-3'><PieChart data={chartData} height={10} /></div>
                                  <div className='col-md-3'><PieChart data={chartData} height={10} /></div>
                                  <div className='col-md-3'><PieChart data={chartData} height={10} /></div>
                                  <div className='col-md-3'><PieChart data={chartData} height={10} /></div>
                                </div> */}
                                {/* <div className='row'>
                                  <div className='col-md-3'><PieChart data={chartData} height={10} /></div>
                                  <div className='col-md-3'><PieChart data={chartData} height={10} /></div>
                                </div> */}
                              </div>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                              <PieChart data={chartData} height={50} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                              <PieChart data={chartData} height={50} />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                              <PieChart data={chartData} height={50} />
                            </TabPanel>
                          </div>
                        </div>
                      ) : (<div></div>)
                    }

                    {/* <Responsive here></Responsive> */}

                  </div>

                ) : (
                  <div></div>
                )}
              </div>)}
              {/* {data.map((entry, index) => (
                <Label
                  key={`label-${index}`}
                  position="center"
                  value={`${entry.name}: ${entry.value}`}
                  fill={COLORS[index % COLORS.length]}
                />))} */}

            </div>
            <div className='col-md-6 image-confusion' ref={divRef}>
              {imageData ? (
                <img src={imageData} alt="Fetched Image" />
              ) : (
                <p></p>
                // <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
        {/* <PieChart width={500} height={300}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart> */}







      </div >

    </div >
  )
}

export default SelectModel
