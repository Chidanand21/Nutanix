import { LightningElement } from 'lwc';

export default class RatingCmp extends LightningElement {

rating(event) {
        let rating = event.target.value;
        var selectedEvent = new CustomEvent('ratingevent', { detail:  {rating : rating}});
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);      
    }
}
