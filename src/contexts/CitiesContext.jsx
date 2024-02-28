import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

//URL
const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  error: "",
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    default:
      throw new Error("Unknown Action");
  }
}

//Context
const CitiesContext = createContext();

//Provider
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setIsError] = useState("");
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, error, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      //Loading
      dispatch({ type: "loading" });
      try {
        //Data
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "cities/loaded", payload: data });
        }
      } catch (err) {
        dispatch({ type: "rejected", payload: err.message });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      //Loading
      dispatch({ type: "loading" });
      try {
        //Data
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "city/loaded", payload: data });
        }
      } catch (err) {
        dispatch({ type: "rejected", payload: err.message });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    //Loading
    dispatch({ type: "loading" });
    try {
      //Data
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: "city/created", payload: data });
      }
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      //One Way of Doing
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        dispatch({ type: "cities/deleted", payload: id });
      }

      //Second Way of Doing
      // await fetch(`${BASE_URL}/cities/${id}`, {
      //   method: "DELETE",
      // });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        error: error,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

//useCities() hook
function useCities() {
  const value = useContext(CitiesContext);
  if (value === undefined) {
    throw new Error("CitiesContext used Outside of the CitiesProvider scope!!");
  }
  return value;
}

export { CitiesProvider, useCities };

//Exports
