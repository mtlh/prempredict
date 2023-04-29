/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */

// @ts-ignore
import * as tf from '@tensorflow/tfjs';
import Load from "@/comps/load";
import Navbar from "@/comps/nav";
import { getInfo } from "@/functions/loading";
import { sortHigh, sortLow} from "@/functions/sorting";
import { useUser } from '@auth0/nextjs-auth0/client';

export async function getServerSideProps(ctx : any) {
  let loading_function_return = await getInfo();
  return {
    props: {"res" : loading_function_return}
  }
}

export default function Index(res: any) {
  const load_data = res.res;
  // console.log(load_data);

  let fixtures = [];
  let results = [];
  for (let match in load_data.matches.matches) {
      if (load_data.matches.matches[match].status.toUpperCase() == "FINISHED") {
        results.push([load_data.matches.matches[match], load_data.matches.matches[match].utcDate]);
      } else {
        if (new Date() < new Date(load_data.matches.matches[match].utcDate)) {
          fixtures.push([load_data.matches.matches[match], load_data.matches.matches[match].utcDate]);
        }
      }
  }
  fixtures = fixtures.sort(sortLow);
  results = results.sort(sortHigh);

  let overall_table = [];
  for (let team in load_data.standings.standings[0].table) {
    overall_table.push(load_data.standings.standings[0].table[team]);
  }

  const predict = (data: tf.Tensor<tf.Rank>) => {
    const weights = tf.tensor([2.5, 0.01])
    const prediction = data.dot(weights)
    return prediction
  }
  const infectedPeople = [2, 5, 12, 30]
  const infectedCountries = [1, 1, 4, 5]
  const data = tf.tensor([infectedPeople[1], infectedCountries[1]])
  const prediction = predict(data)

  const { isLoading, user } = useUser();
  let sendparam = JSON.stringify({"user": user});

  if (isLoading) {
    return (
      <>
        <Load />
      </>
    );
  } else {
    return (
      <>
        <Navbar params={sendparam} />
        <div className="hero bg-base-200 my-4">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <img src={load_data.matches.competition.emblem} alt="League Emblem" className="m-auto justify-center w-40" />
              <h1 className="text-5xl font-bold">{load_data.matches.competition.name} Predictions</h1>
              <p className="py-6">Predicted next day infections... infected people: {data.dataSync()[0]}, infected countries {data.dataSync()[1]}, prediction: {prediction.dataSync()[0]}</p>
            </div>
          </div>
        </div>
        <ul>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="m-auto justify-center text-2xl font-semibold text-center">Results</p>
              {results.map((result) => (
                <li key={result[0].id} className="grid grid-cols-3 my-4 max-w-xl m-auto">
                  <img src={result[0].homeTeam.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                  <div>
                    <p className="m-auto justify-center text-center">{result[0].score.fullTime.home} - {result[0].score.fullTime.away}</p>
                    <p className="m-auto justify-center text-center">{new Intl.DateTimeFormat('en-GB').format(new Date(result[1].toString()))}</p>
                  </div>
                  <img src={result[0].awayTeam.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                </li>
              ))}
            </div>
            <div>
              <p className="m-auto justify-center text-2xl font-semibold text-center">Fixtures</p>
              {fixtures.map((fixture) => (
                <li key={fixture[0].id} className="grid grid-cols-3 my-4 max-w-xl m-auto">
                  <img src={fixture[0].homeTeam.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                  <div>
                    <p className="m-auto justify-center text-center"> - </p>
                    <p className="m-auto justify-center text-center">{new Intl.DateTimeFormat('en-GB').format(new Date(fixture[1].toString()))}</p>
                  </div>
                  <img src={fixture[0].awayTeam.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                </li>
              ))}
            </div>
            <div>
              <p className="m-auto justify-center text-2xl font-semibold text-center">Table</p>
              {overall_table.map((pos) => (
                <li key={pos.team.id} className="grid grid-cols-3 my-4 max-w-xl m-auto">
                  <p className="m-auto justify-center">{pos.position}</p>
                  <img src={pos.team.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                  <p className="m-auto justify-center">{pos.points}</p>
                </li>
              ))}
            </div>
          </div>
        </ul>
      </>
    );
  }
}
