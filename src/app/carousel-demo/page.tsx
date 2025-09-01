import Carousel3D from '../components/Carousel3D';

export default function Carousel3DDemo() {
  return (
    <div style={{ 
      backgroundColor: '#171717', 
      color: 'white', 
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Carousel3D />
    </div>
  );
}