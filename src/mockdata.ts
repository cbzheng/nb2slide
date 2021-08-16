
export const APISlideInfo = {
    template: [{ title: "introduction", subtitles: ['background'] }],
    slidesContent: {
        "introduction": {
            "points": { "background": ["house price"] },
            "cells": {
                "background": [
                    [{
                        "cell_idx": 89,
                        "dist": 0.1
                    }]
                ]
            },
            'img': {},
            'egprompt': ['background']
        }
    },
    slidesOrder: [{
        title: '',
        subtitles: [''],
        startSlide: true,
        endSlide: false
    }
    ],
    sectionWhy: {},
    sectionHow: {}
}


export const mock = "{\"slides\":{\"Conclusion\":{\"cells\":{},\"egprompt\":[\"Suggestions\",\"Ethical & Legal consideration\",\"Limitation & Risks\"],\"img\":{},\"points\":{\"Ethical & Legal consideration\":[\"This model use some data that require special agreements from pernonals\"],\"Limitation & Risks\":[\"Even we carefully tune the model, there are still some biased outputs\"],\"Suggestions\":[\"This model can be used to estimate the investment risks, thus would save the company's money\"]}},\"Data\":{\"cells\":{\"Data cleaning\":[[{\"cell_idx\":65,\"dist\":0.3465411563714345}],[{\"cell_idx\":39,\"dist\":0.3423263033231099}],[{\"cell_idx\":36,\"dist\":0.3000515003999074}],[{\"cell_idx\":14,\"dist\":0.29575469593207043}],[{\"cell_idx\":35,\"dist\":0.2834695676962535}],[{\"cell_idx\":38,\"dist\":0.2650051812330882}],[{\"cell_idx\":33,\"dist\":0.2645198702812195}],[{\"cell_idx\":40,\"dist\":0.2612215479214986}]],\"Exploratory data analysis\":[[{\"cell_idx\":65,\"dist\":0.4282516340414683}],[{\"cell_idx\":90,\"dist\":0.4015701512495677}],[{\"cell_idx\":91,\"dist\":0.39350585142771405}],[{\"cell_idx\":33,\"dist\":0.3677907983462016}],[{\"cell_idx\":70,\"dist\":0.358889639377594}]]},\"egprompt\":[\"Data Source\"],\"img\":{\"Exploratory data analysis\":[65,90,91,33,70]},\"points\":{\"Data Source\":[\"The data is from A university, containing 1 million items\",\"The data is with high quality. Many companies have used it for modeling.\"],\"Data cleaning\":[\"Plots numeric features with their sales price\",\"This function fills in missing values in the features dictionary .\",\"Compute the percentage of missing data for each feature in the dataset\",\"Plots numeric features with their sales price\",\"Returns a list of the most likely missing values .\",\"This function stores the predictors of the predictors in the features dictionary .\",\"Split the features and labels into separate features and labels .\",\"Compute the percent of missing data in the dataframe .\"],\"Exploratory data analysis\":[\"Plots numeric features with their sales price\",\"Blend models to make the final predictions more robust to overfitting .\",\"Compute the RMSLE score of the blended model .\",\"Split the features and labels into separate features and labels .\",\"Root Mean Square Error for cross validation .\"]}},\"Feature Engineering\":{\"cells\":{\"Feature Engineering Summarization\":[[{\"cell_idx\":52,\"dist\":0.5069608390331268}],[{\"cell_idx\":28,\"dist\":0.46197906136512756}],[{\"cell_idx\":55,\"dist\":0.4586239904165268}],[{\"cell_idx\":54,\"dist\":0.4586239904165268}],[{\"cell_idx\":60,\"dist\":0.4567367136478424}],[{\"cell_idx\":59,\"dist\":0.4567367136478424}],[{\"cell_idx\":58,\"dist\":0.4567367136478424}],[{\"cell_idx\":33,\"dist\":0.4541658014059067}]]},\"egprompt\":[],\"img\":{},\"points\":{\"Feature Engineering Summarization\":[\"All features for the streets and pools .\",\"Changes the train data to logarithm 1 - x\",\"Squares the residuals\",\"Computes the log of the residuals\",\"Returns the number of features in the dataset .\",\"Get the features in the cluster .\",\"Reduce the number of features by dropping the index and re - computing the dummies .\",\"Split the features and labels into separate features and labels .\"],\"Feature Engineering: Example\":[\"TODO\"]}},\"Introduction\":{\"cells\":{},\"egprompt\":[\"Workflow\"],\"img\":{},\"points\":{\"Background\":[\"TODO\"],\"Problem\":[\"TODO\"],\"Workflow\":[\"EDA\",\"Feature Engineering\",\"Model Training\",\"Model Evaluation\"]}},\"Model Details\":{\"cells\":{\"Model Details\":[[{\"cell_idx\":90,\"dist\":0.6385685801506042}],[{\"cell_idx\":99,\"dist\":0.6122438112894694}],[{\"cell_idx\":97,\"dist\":0.6103750864664713}],[{\"cell_idx\":2,\"dist\":0.6082488298416138}],[{\"cell_idx\":91,\"dist\":0.598470409711202}]],\"Model Input\":[[{\"cell_idx\":91,\"dist\":0.6003228624661764}],[{\"cell_idx\":93,\"dist\":0.577036996682485}],[{\"cell_idx\":90,\"dist\":0.5724728306134542}]],\"Model Output\":[[{\"cell_idx\":91,\"dist\":0.6256573597590128}],[{\"cell_idx\":93,\"dist\":0.5861592888832092}],[{\"cell_idx\":90,\"dist\":0.5825715661048889}]],\"Optimization\":[[{\"cell_idx\":93,\"dist\":0.5237542490164439}],[{\"cell_idx\":91,\"dist\":0.5150075157483419}],[{\"cell_idx\":90,\"dist\":0.5000620484352112}]]},\"egprompt\":[],\"img\":{},\"points\":{\"Model Alternatives\":[\"RandomForestRegressor\",\"GradientBoostingRegressor\",\"AdaBoostRegressor\",\"BaggingRegressor\",\"KernelRidge\",\"Ridge\",\"RidgeCV\",\"ElasticNet\",\"ElasticNetCV\",\"SVR\",\"GridSearchCV\"],\"Model Details\":[\"Blend models to make the final predictions more robust to overfitting .\",\"Regression2 submission file\",\"Append predictions from blended models to submission .\",\"Image for model training with advanced regression .\",\"Compute the RMSLE score of the blended model .\"],\"Model Input\":[\"Compute the RMSLE score of the blended model .\",\"Plot the scores for each model\",\"Blend models to make the final predictions more robust to overfitting .\"],\"Model Output\":[\"Compute the RMSLE score of the blended model .\",\"Plot the scores for each model\",\"Blend models to make the final predictions more robust to overfitting .\"],\"Optimization\":[\"Plot the scores for each model\",\"Compute the RMSLE score of the blended model .\",\"Blend models to make the final predictions more robust to overfitting .\"]}},\"Model Performance\":{\"cells\":{\"Metrics\":[[{\"cell_idx\":70,\"dist\":0.4828082323074341}],[{\"cell_idx\":65,\"dist\":0.42304084698359173}],[{\"cell_idx\":30,\"dist\":0.4163653552532196}]],\"Performance\":[[{\"cell_idx\":2,\"dist\":0.6834847778081894}],[{\"cell_idx\":93,\"dist\":0.682148277759552}],[{\"cell_idx\":91,\"dist\":0.6393653750419617}]]},\"egprompt\":[],\"img\":{\"Performance\":[2,93,91]},\"points\":{\"Metrics\":[\"Root Mean Square Error for cross validation .\",\"Plots numeric features with their sales price\",\"Plot the distribution of the new distribution\"],\"Performance\":[\"Image for model training with advanced regression .\",\"Plot the scores for each model\",\"Compute the RMSLE score of the blended model .\"]}}},\"template\":[{\"subtitles\":[\"Background\",\"Problem\",\"Workflow\"],\"title\":\"Introduction\"},{\"subtitles\":[\"Data Source\",\"Exploratory data analysis\",\"Data cleaning\"],\"title\":\"Data\"},{\"subtitles\":[\"Feature Engineering Summarization\",\"Feature Engineering: Example\"],\"title\":\"Feature Engineering\"},{\"subtitles\":[\"Model Input\",\"Model Output\",\"Optimization\",\"Model Alternatives\",\"Model Details\"],\"title\":\"Model Details\"},{\"subtitles\":[\"Metrics\",\"Performance\"],\"title\":\"Model Performance\"},{\"subtitles\":[\"Suggestions\",\"Ethical & Legal consideration\",\"Limitation & Risks\"],\"title\":\"Conclusion\"}]}\n"