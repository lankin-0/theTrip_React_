import styles from "./CityList.module.css";
//Context
import { useCities } from "../contexts/CitiesContext";
//components
import Spinner from "./Spinner";
import Message from "./Message";
import CityItem from "./CityItem";

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add Your First City by Selecting a city on the Map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        return <CityItem key={city.id} city={city} />;
      })}
    </ul>
  );
}
export default CityList;
