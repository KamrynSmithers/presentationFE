import { useNavigate } from "react-router-dom";
import "../App.css";
import '../choices.css'

function MediaSelection() {
  const navigate = useNavigate();

  return (
    <div className="media-container">
      {/* BOOKS SECTION */}
      <div 
        className="media-section"
        style={{
          backgroundImage: "url('https://m.media-amazon.com/images/I/81kejUIurGL._SL1500_.jpg')"
        }}
      >
        <button
          className="Mediabutton"
          onClick={() => navigate("/books")}
        >
          BOOKS
        </button>
      </div>

      {/* MOVIES SECTION */}
      <div 
        className="media-section"
        style={{
          backgroundImage: "url('https://m.media-amazon.com/images/I/81uTQDeL9SL.jpg')"
        }}
      >
        <button
          className="Mediabutton"
          onClick={() => navigate("/movies")}
        >
          MOVIES
        </button>
      </div>

      {/* MUSIC SECTION */}
      <div 
        className="media-section"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/6d/a7/70/6da7708a673f604e7e4c5d20827eaa11.jpg')"
        }}
      >
        <button
          className="Mediabutton"
          onClick={() => navigate("/music")}
        >
          MUSIC
        </button>
      </div>
    </div>
  );
}

export default MediaSelection;