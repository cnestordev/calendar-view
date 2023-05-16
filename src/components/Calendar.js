import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import TimePicker from "material-ui/TimePicker";
require("react-big-calendar/lib/css/react-big-calendar.css");

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      events: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      openSlot: false,
      openEvent: false,
      clickedEvent: {}
    };
    this.handleClose = this.handleClose.bind(this);
  }

  // componentDidMount(){
  //     this.getCachedEvents();
  // }

  // getCachedEvents(){
  //   const cachedEvents = localStorage.getItem("cachedEvents");
  //   console.log("Cached Events", JSON.parse(cachedEvents));
  //   if(cachedEvents){
  //       this.setState({events: JSON.parse(cachedEvents)})
  //   }
  //   return;
  // }

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false });
  }

  handleClick() {
    console.log(this.state.events);
    const appts = [
      '2023-05-15T22:10:00.000Z', 
      '2023-05-18T16:30:00.000Z', 
      '2023-05-18T20:00:00.000Z', 
      '2023-05-19T21:05:00.000Z', 
      '2023-05-19T23:00:00.000Z', 
      '2023-05-19T23:10:00.000Z', 
      '2023-05-20T00:00:00.000Z'
    ]
    const newAppts = appts.map((elm, i) => {
      return {
        title: `test${i}`,
        desc: "testing 123",
        start: new Date(elm),
        end: new Date(elm)
      };
    });
    console.log(newAppts);
    this.setState({ events: newAppts });
  }

  //  Allows user to click on calendar slot and handles if appointment exists
  handleSlotSelected(slotInfo) {
    this.setState({
      title: "",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true
    });
  }

  handleEventSelected(event) {
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc
    });
  }

  setTitle(e) {
    this.setState({ title: e });
  }

  setDescription(e) {
    this.setState({ desc: e });
  }

  handleStartTime = (event, date) => {
    this.setState({ start: date });
  };

  handleEndTime = (event, date) => {
    this.setState({ end: date });
  };

  // Onclick callback function that pushes new appointment into events array.
  setNewAppointment() {
    console.log(this.state.events);
    // const { start, end, title, desc } = this.state;
    // let appointment = { title, start, end, desc };
    // let events = this.state.events.slice();
    // events.push(appointment);
    // // localStorage.setItem("cachedEvents", JSON.stringify(events));
    // this.setState({ events });
  }

  //  Updates Existing Appointments Title and/or Description
  updateEvent() {
    const { title, desc, start, end, events, clickedEvent } = this.state;
    const index = events.findIndex((event) => event === clickedEvent);
    const updatedEvent = events.slice();
    updatedEvent[index].title = title;
    updatedEvent[index].desc = desc;
    updatedEvent[index].start = start;
    updatedEvent[index].end = end;
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvent));
    this.setState({
      events: updatedEvent
    });
  }

  //  filters out specific event that is to be deleted and set that variable to state
  deleteEvent() {
    let updatedEvents = this.state.events.filter(
      (event) => event["start"] !== this.state.start
    );
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });
  }

  render() {
    const eventActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onClick={() => {
          this.deleteEvent(), this.handleClose();
        }}
      />,
      <FlatButton
        label="Confirm Edit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.updateEvent(), this.handleClose();
        }}
      />
    ];
    const appointmentActions = [
      <FlatButton label="Cancel" secondary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.setNewAppointment(), this.handleClose();
        }}
      />
    ];
    return (
      <div id="Calendar">
        <button onClick={() => this.handleClick()}>Test#@</button>
        {/* react-big-calendar library utilized to render calendar*/}
        <BigCalendar
          events={this.state.events}
          views={["month", "week", "day", "agenda"]}
          timeslots={2}
          defaultView="month"
          defaultDate={new Date()}
          selectable={true}
          onSelectEvent={(event) => this.handleEventSelected(event)}
          onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog
          title={`Book an appointment on ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={appointmentActions}
          modal={false}
          open={this.state.openSlot}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="Title"
            onChange={(e) => {
              this.setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            onChange={(e) => {
              this.setDescription(e.target.value);
            }}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="Start Time"
            minutesStep={5}
            value={this.state.start}
            onChange={this.handleStartTime}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="End Time"
            minutesStep={5}
            value={this.state.end}
            onChange={this.handleEndTime}
          />
        </Dialog>

        {/* Material-ui Modal for Existing Event */}
        <Dialog
          title={`View/Edit Appointment of ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={eventActions}
          modal={false}
          open={this.state.openEvent}
          onRequestClose={this.handleClose}
        >
          <TextField
            defaultValue={this.state.title}
            floatingLabelText="Title"
            onChange={(e) => {
              this.setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            multiLine={true}
            defaultValue={this.state.desc}
            onChange={(e) => {
              this.setDescription(e.target.value);
            }}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="Start Time"
            minutesStep={5}
            value={this.state.start}
            onChange={this.handleStartTime}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="End Time"
            minutesStep={5}
            value={this.state.end}
            onChange={this.handleEndTime}
          />
        </Dialog>
      </div>
    );
  }
}

export default Calendar;
