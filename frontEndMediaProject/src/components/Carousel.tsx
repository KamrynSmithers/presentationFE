import '../carousel.css'
import carrieBook from '../assets/images/carrieBook.jpg'
const images = [
    
  "https://m.media-amazon.com/images/I/81uTQDeL9SL.jpg",
  "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/igMjYEnuIL7g/v0/-1x-1.webp",
  "https://pbs.twimg.com/media/FxmEVTZWwAAgtcV.jpg",
  "https://m.media-amazon.com/images/I/81ZJee0YoIL._AC_UF894,1000_QL80_.jpg",
  "https://i.ebayimg.com/images/g/-VIAAOSwIvFhWGuJ/s-l1200.jpg",
  "https://m.media-amazon.com/images/I/81VeeaIPzmL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/M/MV5BMTk2ZmFhYjctYWZiYy00N2IxLWEzMWItZGRiMDY4ZDQwZWFlXkEyXkFqcGc@._V1_.jpg",
  "https://i.pinimg.com/736x/f9/f5/c4/f9f5c47d9b767e704875a83daa8c7d12.jpg",
  "https://www.movieposters.com/cdn/shop/files/marty-supreme_ozlejkxr_0c1cce34-743c-4c79-be65-5604d60bfea9_1024x1024.jpg?v=1764013999",
  "https://prodimage.images-bn.com/pimages/9781649374189_p0_v9_s600x595.jpg",
  carrieBook,
]

function Carousel() {
  return (
    <div className="carousel">
      <div className="inner">
        <div className="group">
          {images.map((src, i) => (
            <div className="card" key={`a-${i}`}>
              <img src={src} alt={`card-${i}`} draggable={false} />
            </div>
          ))}
        </div>

        <div className="group" aria-hidden>
          {images.map((src, i) => (
            <div className="card" key={`b-${i}`}>
              <img src={src} alt={`card-${i}`} draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
