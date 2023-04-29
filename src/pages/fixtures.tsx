/* eslint-disable jsx-a11y/anchor-is-valid */
;
import Load from "@/comps/load";
import Nav from "@/comps/nav";
import { getInfo } from "@/functions/loading";
import { sortLow } from "@/functions/sorting";
import { useUser } from '@auth0/nextjs-auth0/client';

export async function getServerSideProps(ctx : any) {
  let loading_function_return = await getInfo();
  return {
    props: {"res" : loading_function_return}
  }
}

export default function Fixtures(res: any) {
  const load_data = res.res;
  //console.log(load_data);

  let fixtures = [];
  for (let match in load_data.matches.matches) {
    if (new Date() < new Date(load_data.matches.matches[match].utcDate)) {
        fixtures.push([load_data.matches.matches[match], load_data.matches.matches[match].utcDate]);
    }
  }
  fixtures = fixtures.sort(sortLow);

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
        <Nav params={sendparam} />
        <ul>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-6xl m-auto">
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
          </div>
        </ul>
      </>
    );
  }
}
