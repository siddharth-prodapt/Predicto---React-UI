import axios, { AxiosResponse } from 'axios';
// export let API_ENDPOINTS = '10.169.60.84';
// export let API_ENDPOINTS = "8625-161-69-80-64.ngrok-free.app"
export let API_ENDPOINTS = 'localhost';
export let portNo = ":8000";
// export let portNo = "";
// export let portNo = ":8080";
// export let httpValue = 'https://';
export let httpValue = 'http://';

const encodedColumnName = (columnName: any) => {
    return encodeURIComponent(columnName).replace(/%2B/g, '%2B');
}

export const fileUpload = async (userId: any, formData: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/user/' + userId + '/file', formData);
    } catch (error) {
        throw new Error('Failed to upload file');
    }
};

export const logoutUser = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/auth/logout');
    } catch (error) {
        throw new Error('Failed to logout!');
    }
};

export const fileDelete = async (userId: any, fileID: any, fileName: any): Promise<AxiosResponse> => {
    const params = {
        "id": fileID,
        "filename": fileName
    }
    try {
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/user/' + userId + '/file', { params });
    } catch (error) {
        throw new Error('Failed to delete file');
    }
};

export const fileRename = async (userId: any, fileID: any, oldFileName: any, newFileName: any): Promise<AxiosResponse> => {
    try {
        return await axios.put(httpValue + API_ENDPOINTS + portNo + '/user/' + userId + '/file', {
            "id": fileID,
            "orginal_filename": oldFileName,
            "new_filename": newFileName
        });
    } catch (error) {
        throw new Error('Failed to rename file');
    }
};

export const signUpUser = async (userData: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/auth/signup', userData);
    } catch (error) {
        throw new Error('Failed to sign up');
    }
};

export const signInUser = async (userData: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/auth/signin', userData);
    } catch (error) {
        throw new Error('Failed to sign in');
    }
};

export const getUserFileDetailsByID = async (userID: any): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/user/' + userID + '/file/list');
    } catch (error) {
        throw new Error('Failed to fetch user details by ID');
    }
};

export const getColumnOrderForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/columnOrder');
    } catch (error) {
        throw new Error('Failed to fetch column order');
    }
};

export const getHeadDataForTable = async (userID: any, fileName: any, limitOfRows: any): Promise<AxiosResponse> => {
    try {
        const params = {
            "id": userID,
            "filename": fileName,
            "limit": limitOfRows
        }
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/headData', { params }
        );
    } catch (error) {
        throw new Error('Failed to fetch head');
    }
};

export const getTailDataForTable = async (userID: any, fileName: any, limitOfRows: any): Promise<AxiosResponse> => {
    try {
        const params = {
            "id": userID,
            "filename": fileName,
            "limit": limitOfRows
        }
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/tailData', { params }
        )
    } catch (error) {
        throw new Error('Failed to fetch tail');
    }
};

export const addRowForTable = async (requestBody: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dl/add-row', requestBody
        )
    } catch (error) {
        throw new Error('Failed to add a new row');
    }
};

export const getPreprocessingMethodList = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/getPreprocessingMethods');
    } catch (error) {
        throw new Error('Failed to fetch preprocessing method list');
    }
};

export const getAvailableModelsList = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/getAvailableModels');
    } catch (error) {
        throw new Error('Failed to fetch available models list');
    }
};

export const getTotalCopyListDataframeForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dataframe/copy/list');
    } catch (error) {
        throw new Error('Failed to fetch available dataframe copy list');
    }
};

export const getSelectedCopyDataframeForTable = async (df_id: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dataframe/copy/pick/' + df_id);
    } catch (error) {
        throw new Error('Failed to select a dataframe copy');
    }
};


export const identifyDateAndTimeForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/pre/identify/datetime');
    } catch (error) {
        throw new Error('Failed to identify date and time');
    }
};

export const getPresentNullValuesForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/getTotalNullValues');
    } catch (error) {
        throw new Error('Failed to fetch null values');
    }
};

export const getDataFrameShapeForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/getDataFrameShape');
    } catch (error) {
        throw new Error('Failed to dataframe shape');
    }
};

export const getDataFrameSizeForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/getDataFrameSize');
    } catch (error) {
        throw new Error('Failed to fetch dataframe size');
    }
};

export const getDataInfoForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/getDataFrameInfo');
    } catch (error) {
        throw new Error('Failed to get data info!');
    }
};

export const getNumericDataDescriptionForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/describeData');
    } catch (error) {
        throw new Error('Failed to get numeric data description!');
    }
};

export const getAllDataDescriptionForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/describeTheData');
    } catch (error) {
        throw new Error('Failed to get all data description!');
    }
};

export const createACopyDataframe = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dataframe/copy');
    } catch (error) {
        throw new Error('Failed to create a copy!');
    }
};

export const deleteDataframe = async (): Promise<AxiosResponse> => {
    try {
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/dataframe');
    } catch (error) {
        throw new Error('Failed to delete dataframe!');
    }
};

export const getUniqueValuesForTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/pre/countUniqueElements');
    } catch (error) {
        throw new Error('Failed to fetch unique values!');
    }
};

export const getUniqueValuesByColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/pre/uniqueElements?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Failed to fetch unique values for column!');
    }
};

export const dropAllRowsContainingNULLValues = async (): Promise<AxiosResponse> => {
    try {
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/pre/dropNullValues');
    } catch (error) {
        throw new Error('Failed to drop null value rows!');
    }
};

export const dropAllRowsContainingNULLValuesofColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        let params: any = {
            "column_name": encodedColumnName(columnName)
        }
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/pre/dropNullValuesColumn', { params: params });
    } catch (error) {
        throw new Error('Failed to drop null value rows of column!');
    }
};

export const dropDuplicateRowsFromTable = async (): Promise<AxiosResponse> => {
    try {
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/pre/duplicateRows');
    } catch (error) {
        throw new Error('Failed to drop duplicate rows!');
    }
};

export const createAColumn = async (newColumnName: any, calculations: any): Promise<AxiosResponse> => {
    try {
        let formData = {
            "newColumnName": newColumnName,
            "calculations": calculations
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dl/calculateColumn', formData);
    } catch (error) {
        throw new Error('Failed to create a column!');
    }
};

export const dragColumnForTable = async (fromIndex: any, toIndex: any): Promise<AxiosResponse> => {
    try {
        let params = {
            "fromIndex": fromIndex,
            "toIndex": toIndex
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dl/dragColumn', null, {
            params: params
        });
    } catch (error) {
        throw new Error('Failed to drag column');
    }
};

export const convertColumnToNumeric = async (column_name: any): Promise<AxiosResponse> => {
    try {
        let params = {
            "column_name": encodedColumnName(column_name)
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dl/convert-column-to-numeric', null, {
            params: params
        });
    } catch (error) {
        throw new Error('Failed to convert column to numeric!');
    }
};

export const convertAllToNumeric = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dl/convert-numeric-col');
    } catch (error) {
        throw new Error('Failed to convert column to numeric!');
    }
};

export const deleteAColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        let params = {
            "column_name": columnName,
        }
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/dl/column', {
            params: params
        });
    } catch (error) {
        throw new Error('Failed to delete column');
    }
};

export const getDataTypesForTable = async (userID: any, fileName: any): Promise<AxiosResponse> => {
    try {
        const params = {
            "id": userID,
            "filename": fileName
        }
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/dl/getDataTypes', { params });
    } catch (error) {
        throw new Error('Failed to fetch data types of column');
    }
};

export const createDataFrame = async (userID: any, fileName: any): Promise<AxiosResponse> => {
    try {
        let formData = {
            "userId": userID,
            "filename": fileName
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dataframe', formData);
    } catch (error) {
        throw new Error('Failed to create dataframe');
    }
};

export const barChartFromDataframe = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "x_columns": formDataGiven['x_columns'],
            "y_columns": formDataGiven['y_columns'],
            "title": formDataGiven['title'],
            "xlabel": formDataGiven['xlabel'],
            "ylabel": formDataGiven['ylabel']
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/bar-chart-from-dataframe', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const baseURLTEST = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/testing/hello');
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const boxPlotGraphPlot = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "userId": formDataGiven['userId'],
            "x_label": formDataGiven['x_label'],
            "y_label": formDataGiven['y_label'],
            "xticks_rotation": formDataGiven['xticks_rotation'],
            "figsize": formDataGiven['figsize'],
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/boxplot', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const corelationMatrixPlot = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "method": formDataGiven['method'],
            "annot": formDataGiven['annot'],
            "cmap": formDataGiven['cmap'],
            "figsize": formDataGiven['figsize'],
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/plot-correlation-matrix', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const plotDataframeDescPlot = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "figsize": formDataGiven['figsize'],
            "bar_width": formDataGiven['bar_width'],
            "error_bars": formDataGiven['error_bars']
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/plot-dataframe-desc', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const plotCustomScatterPlot = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "x_col": formDataGiven["x_col"],
            "y_col": formDataGiven["y_col"],
            "hue_col": formDataGiven["hue_col"],
            "xlabel": formDataGiven["xlabel"],
            "ylabel": formDataGiven["ylabel"],
            "title": formDataGiven["title"],
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/scatterplot/custom-scatter-plot', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const scatterPlotEachColumn = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "target_column": formDataGiven["target_column"],
            "hue_column": formDataGiven["hue_column"],
            "hue_order": formDataGiven["hue_order"]
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/scatterplot/scatterplot-each-column', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const barchartPlot = async (formDataGiven: any): Promise<AxiosResponse> => {
    try {
        let formData =
        {
            "categories": formDataGiven["categories"],
            "values": formDataGiven["values"],
            "title": formDataGiven["title"],
            "xlabel": formDataGiven["xlabel"],
            "ylabel": formDataGiven["ylabel"]
        }
        console.log(formData)
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/barchart', formData);
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const plotStatsSummary = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/visualisations/plot-stats-summary');
    } catch (error) {
        throw new Error('Failed to plot Bar Chart From Dataframe!');
    }
};

export const getXLSFile = async (userID: any, fileName: any): Promise<AxiosResponse> => {
    try {
        const params = {
            // Define your parameters here
            filename: fileName
        };
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/user/' + userID + '/file', {
            params, responseType: 'arraybuffer',
            onDownloadProgress: (progressEvent: any) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log("percentCompleted", percentCompleted);
            },
        },
        );

    } catch (error) {
        throw new Error('Failed to get XLS File');
    }
};



///////////////////////////// NORMALIZATION APIs /////////////////////////////


export const meanNormalization = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/mean-normalisation');
    } catch (error) {
        throw new Error('Mean Normalization Failed!');
    }
};

export const meanNormalizationColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/mean-normalisation-column?column_name=' + columnName);
    } catch (error) {
        throw new Error('Mean Normalization for column Failed!');
    }
};

export const labelEnocdeColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/label-encode-column?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Label Encode for column Failed!');
    }
};

export const labelEnocdeColumnInverse = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/label-encode-column/inverse?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Label Encode for column Failed!');
    }
};

export const minMaxScaling = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/min-max-scaling');
    } catch (error) {
        throw new Error('Min max scaling Failed!');
    }
};

export const minMaxScalingColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/min-max-scaling-column?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Min max scaling for column Failed!');
    }
};

export const robustScaling = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/robust-scaling');
    } catch (error) {
        throw new Error('Robust Scaling Failed!');
    }
};

export const robustScalingColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/robust-scaling-column?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Robust Scaling for column Failed!');
    }
};

export const unitVectorScaling = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/unit-vector-scaling');
    } catch (error) {
        throw new Error('Unit Vector Scaling Failed!');
    }
};

export const unitVectorScalingColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/unit-vector-scaling-column?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Unit Vector Scaling for column Failed!');
    }
};

export const zScoreNorm = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/z-score-normalisation');
    } catch (error) {
        throw new Error('Z Score Normalization Failed!');
    }
};

export const zScoreNormColumn = async (columnName: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/normalization/z-score-normalisation-column?column_name=' + encodedColumnName(columnName));
    } catch (error) {
        throw new Error('Z Score Normalization for column Failed!');
    }
};

export const fillNULLWithStats = async (columnName: any, attribute: any): Promise<AxiosResponse> => {
    try {
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/pre/fillNullWithStats?column_name=' + encodedColumnName(columnName) + '&strategy=' + attribute);
    } catch (error) {
        throw new Error('Fill Null with stats failed!');
    }
};

export const fillNULLWithAttribute = async (columnName: any, attribute: any): Promise<AxiosResponse> => {
    try {
        return await axios.delete(httpValue + API_ENDPOINTS + portNo + '/pre/fillNullWithAttr?column_name=' + encodedColumnName(columnName) + '&attribute=' + attribute);
    } catch (error) {
        throw new Error('Fill Null with attribute failed!');
    }
};



///////////////////////////// MODEL APIs /////////////////////////////

export const trainTestSplitData = async (columnList: any, test_size: any): Promise<AxiosResponse> => {
    try {
        let postData = {
            "target_columns": columnList,
            "test_size": test_size,
            "random_state": 0
        }
        console.log("train and test split data", postData);
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/dataset/train-test-split-data', postData);
    } catch (error) {
        throw new Error('Test and Train Split Failed!');
    }
};

export const saveModel = async (userId: any, filename: any): Promise<AxiosResponse> => {
    try {
        let postData = {
            "userId": userId,
            "filename": filename
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/save', postData);
    } catch (error) {
        throw new Error('Save Model Failed!');
    }
};

export const saveDataframe = async (userId: any, filename: any): Promise<AxiosResponse> => {
    try {
        let postData = {
            "userId": userId,
            "filename": filename
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/dataframe/save', postData);
    } catch (error) {
        throw new Error('Save Dataframe Failed!');
    }
};

export const savePickle = async (userId: any, filename: any): Promise<AxiosResponse> => {
    try {
        let postData = {
            "userId": userId,
            "filename": filename
        }
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/save/pickle', postData);
    } catch (error) {
        throw new Error('Model pickle save Failed!');
    }
};

export const downloadFileFromPath = async (userId: any, filepath: any): Promise<AxiosResponse> => {
    try {
        const params = {
            "filepath": filepath
        }
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/user/' + userId + '/file/download', { params, responseType: 'arraybuffer' });
    } catch (error) {
        throw new Error('Failed to download file!');
    }
};

export const createModel = async (model_type: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model',
            { "model_type": model_type }
        );
    } catch (error) {
        throw new Error('Model creation Failed!');
    }
};

export const fitModel = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/train/fit-model');
    } catch (error) {
        throw new Error('Model Fit Failed!');
    }
};

export const predictWithModel = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/train/predict-with-model');
    } catch (error) {
        throw new Error('Model Predict Failed!');
    }
};

export const evaluatePredictions = async (): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/train/evaluate-predictions');
    } catch (error) {
        throw new Error('Evaluate Predict Failed!');
    }
};




export const getConfusionMatrix = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/model/confusion-matrix');
    } catch (error) {
        throw new Error('Failed to fetch confusion matrix');
    }
};

export const plotConfusionMatrix = async (column_name: any): Promise<AxiosResponse> => {
    try {
        return await axios.post(httpValue + API_ENDPOINTS + portNo + '/model/confusion-matrix?column_name=' + column_name);
    } catch (error) {
        throw new Error('Failed to plot confusion matrix');
    }
};


export const historyTracker = async (): Promise<AxiosResponse> => {
    try {
        return await axios.get(httpValue + API_ENDPOINTS + portNo + '/history/operations-performed');
    } catch (error) {
        throw new Error('Failed to convert column to numeric!');
    }
};