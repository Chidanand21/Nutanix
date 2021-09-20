public class CustomerFeeback {
    @AuraEnabled
    Public static boolean submitFeedback(String name,String email,String phone,String movieDate,String rating,String feedback){
        try{
        movieFeedback__c movieFeedback = new movieFeedback__c();
        movieFeedback.Name = name;
        movieFeedback.Email__c = email;
        movieFeedback.Mobile_Number__c = phone;
        movieFeedback.Movie_Watching_Date__c = Date.valueOf(movieDate);
        movieFeedback.User_Rating__c = Integer.valueOf(rating);
        movieFeedback.Feedback_Info__c = feedback;
        insert movieFeedback;
            return true;
        }
        catch(Exception exe){
            return false;
        }
    }

}
