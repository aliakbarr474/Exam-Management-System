import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./seats.css";
import Swal from "sweetalert2";
import Classroom from "./Classroom";

export default function Seats() {
  const [display, toggleDisplay] = useState(true);
  const [add, toggleAdd] = useState(false);
  const [mainDisplay, toggleMainDisplay] = useState(false);
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomChange, setRoomChange] = useState("");
  const [date, setDate] = useState("");
  const [plan, setPlan] = useState("");

  const addRoom = async () => {
    try {
      const response = await fetch("http://localhost:5000/rooms/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await response.json();

      if (response.ok) {
        setRooms((prev) => [...prev, result]);
      }
    } catch (error) {
      console.log("Error occured: ", error);
    }

    Swal.fire({
      title: "Room Added Successfully!",
      icon: "success",
    });

    toggleAdd(false);
    setName("");
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch("http://localhost:5000/rooms/show");
        if (!response.ok) {
          console.log("Error retrieving data");
        }

        const result = await response.json();
        setRooms(result);
      } catch (error) {
        console.log("Error occured: ", error);
      }
    };

    fetchRoom();
  }, []);

  const handleRoom = (e) => {
    setRoomChange(e.target.value);
    toggleDisplay(false);
    toggleMainDisplay(true);
  };

  const changeRoom = () => {
    toggleDisplay(true);
    toggleMainDisplay(false);
  }

  return (
    <div>
      <Navbar /> 
      <div className="main-seats">
        {display && (
          <div className="room-selector">
            <div className="room-selector-content">
              <h2>Select Room</h2>

              <select name="rooms" required className="room-dropdown" onChange={handleRoom} value={roomChange}>
                <option value="" disabled hidden>
                  Choose a Room
                </option>
                {rooms.map((room) => (
                  <option key={room.room_id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>

              <button
                className="room-add-btn room-adder"
                onClick={() => toggleAdd(true)}
              >
                + Add Room
              </button>
            </div>
          </div>
        )}

        {mainDisplay && (
          <div className="room-display">
            <div className="room-heading-div">
              <div className="room-heading">
                <h2>Room: </h2>
                <p>{roomChange}</p>
              </div>

              <select name="rooms" required className="plan-dropdown" onChange={(e) => setPlan(e.target.value)} value={plan}>
                  <option value="" disabled hidden>Choose a plan</option>
                  <option>Mid-term</option>
                  <option>Final-term</option>
              </select>

              <input type="date" className="date-picker"
              value={date} onChange={(e) => setDate(e.target.value)}></input>

              <button className="change-btn" onClick={changeRoom}>Change Room</button>
            </div>
            <Classroom room={roomChange} />
          </div>
        )}

        {add && (
          <div className="popup-overlay">
            <div className="add-popup">
              <div className="close-div">
                <button onClick={() => toggleAdd(false)} className="close-btn">
                  &times;
                </button>
              </div>

              <h2>Add Room</h2>

              <div className="add-div">
                <input
                  placeholder="Room Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              <button className="add-btn" onClick={addRoom}>
                Add
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
