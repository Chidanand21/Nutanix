import { LightningElement } from 'lwc';
const QUERY_URL = "https://www.omdbapi.com/?t="; 
const QUERY_URL_2 = "&apikey=ae26e2e8"; 
import { createRecord } from 'lightning/uiRecordApi';
import submitFeedback from '@salesforce/apex/CustomerFeeback.submitFeedback';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class MovieSearch extends LightningElement {
    urltocall;
    showval;
    backupimg;
    datafound;
    nodata;
    showNextButton;
    showPage1=true;
    showPage2;
    showPage2Part1;
    page2Part1DataFilled;
    page2Part2DataFilled;
    showPage2Part2;
    contactName;
    contactEmail;
    contactPhone;
    movieWatchingDate;
    rating;
    enableSubmitButton;
    feedback;
    endPointUrl(event) {
        let movieStr = event.target.value;
        let finalurl = QUERY_URL + movieStr + QUERY_URL_2;
        this.urltocall = finalurl;
    }
    get options() {
        return [
            { label: '', value: 'select' }
        ];
    }
    fetchMovieDetails(){
        fetch(this.urltocall)
            .then((response) => {
                if (!response.ok) {
                    this.error = response;
                }
                return response.json();
            })
            .then((jsonResponse) => {
                this.datafound = true;
                this.nodata = false;
                this.showval = jsonResponse;
                this.backupimg = false;

                if (JSON.stringify(this.showval).includes("Error")) {
                    this.datafound = false;
                    this.nodata = true;
                }
                if (this.showval.Poster.includes("N/A")) {
                    this.backupimg = true;
                }
                /*In order to show Progress Rings which accept number values (1-100),
                I am converting the JSON response for Ratings into usable format for rings.
                Check the JSON response Sample for more clarity*/
                for (var i = 0; i < this.showval.Ratings.length; i++) {
                    if (this.showval.Ratings[i].Source.includes("Internet")) {
                        let imdb = this.showval.Ratings[i].Value.split("/");
                        this.showval.Ratings[i].newValue = imdb[0] * 10;
                    }
                    if (this.showval.Ratings[i].Source.includes("Metacritic")) {
                        let imdb = this.showval.Ratings[i].Value.split("/");
                        this.showval.Ratings[i].newValue = imdb[0];
                    }
                    if (this.showval.Ratings[i].Source.includes("Rotten")) {
                        let imdb = this.showval.Ratings[i].Value.split("%");
                        this.showval.Ratings[i].newValue = imdb[0];
                    }
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }
    handleRadioChange(){
        this.showNextButton = true;
    }
    navigateUserDetailsPage(){
        this.showPage1 = false; 
        this.showNextButton = false;
        this.showPage2 = true;
        this.showPage2Part1=true;
        if(this.page2Part1DataFilled){
            this.showPage2Part2 = true;
            this.showPage2Part1=false;
        }
    }
    nameChangedHandler(event){
        this.contactName = event.target.value;
        this.contactEmail = this.template.querySelector('.email').value;
        console.log('-contactEmail-'+this.contactEmail);
        this.contactPhone = this.template.querySelector('.mobile').value;
        this.movieWatchingDate = this.template.querySelector('.date').value;
        if(this.contactName && this.contactEmail && this.contactPhone && this.movieWatchingDate){
            this.page2Part1DataFilled = true;
            this.showNextButton = true;
        }
        else{
            this.page2Part1DataFilled = false;
            this.showNextButton = false;
        }
    
    }
    emailChangedHandler(event){
        this.contactEmail = event.target.value;
        this.contactName = this.template.querySelector('.name').value;
        this.contactPhone = this.template.querySelector('.mobile').value;
        this.movieWatchingDate = this.template.querySelector('.date').value;
        if(this.contactName && this.contactEmail && this.contactPhone && this.movieWatchingDate){
            this.page2Part1DataFilled = true;
            this.showNextButton = true;
        }
        else{
            this.page2Part1DataFilled = false;
            this.showNextButton = false;
        }
    }
    phoneChangedHandler(event){
        this.contactPhone = event.target.value;
        this.contactEmail = this.template.querySelector('.email').value;
        this.contactName = this.template.querySelector('.name').value;
        this.movieWatchingDate = this.template.querySelector('.date').value;
        if(this.contactName && this.contactEmail && this.contactPhone && this.movieWatchingDate){
            this.page2Part1DataFilled = true;
            this.showNextButton = true;
        }
        else{
            this.page2Part1DataFilled = false;
            this.showNextButton = false;
        }
    }
    dateChangedHandler(event){
        this.movieWatchingDate = event.target.value;
        console.log('1'+this.movieWatchingDate);
        this.contactPhone = this.template.querySelector('.mobile').value;
        console.log('contactPhone'+this.contactPhone);
        this.contactEmail = this.template.querySelector('.email').value;
        console.log('contactEmail'+this.contactEmail);
        this.contactName = this.template.querySelector('.name').value;
        console.log('contactName'+this.contactName);
        if(this.contactName && this.contactEmail && this.contactPhone && this.movieWatchingDate){
            this.page2Part1DataFilled = true;
            this.showNextButton = true;
        }
        else{
            this.page2Part1DataFilled = false;
            this.showNextButton = false;
        }
    }
    handleRating(event){
        this.rating = event.detail.rating;
        this.feedback = this.template.querySelector('.feedback').value;
        if(this.rating && this.feedback){
            this.enableSubmitButton = true;
            this.page2Part2DataFilled = true;
        }
        else{
            this.enableSubmitButton = false;
            this.page2Part2DataFilled = false;
        }
        //alert('-rating-'+this.rating);
    }
    feedbackChangedHandler(event){
        console.log('rating'+this.rating);
        this.feedback = event.target.value;
        if(this.feedback && this.rating){
            this.enableSubmitButton = true;
            this.page2Part2DataFilled = true;
        }
        else{
            this.enableSubmitButton = false;
            this.page2Part2DataFilled = false;
        }

    }
    Submit(){
        /*
        // Creating mapping of fields of Movies Feedback with values
        var fields = {'Name' : this.contactName, 'Email__c' : this.contactEmail, 'Mobile_Number__c' : this.contactPhone,'Movie_Watching_Date__c':this.movieWatchingDate,'User_Rating__c':this.rating,'Feedback_Info__c':this.feedback};

        // Record details to pass to create method with api name of Object.
        var objRecordInput = {'apiName' : 'movieFeedback__c', fields};

        // LDS method to create record.
        createRecord(objRecordInput).then(response => {
            alert('Movie Feedback created with Id: ' +response.id);
        }).catch(error => {
            alert('Error: ' +JSON.stringify(error));
        });
    }
    */
    submitFeedback({
        name:this.contactName,email:this.contactEmail,phone:this.contactPhone,movieDate:this.movieWatchingDate,rating:this.rating,feedback:this.feedback
    })
        .then(result => {
            if(result){
                /*
                const evt = new ShowToastEvent({
                    title: "Success",
                    message: "Feedback Saved Successfully!!!",
                    variant: "success",
                });
                this.dispatchEvent(evt);
                */
                alert('Feedback Saved Successfully!!!');
            }
            else{
                alert('ERROR');
            }
        })
        .catch(error => {
            this.error = error;
        });

    
}
}
