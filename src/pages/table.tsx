/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */

import Load from "@/comps/load";
import Nav from "@/comps/nav";
import { getInfo } from "@/functions/loading";
import { useUser } from "@auth0/nextjs-auth0/client";

export async function getServerSideProps(ctx : any) {
  let loading_function_return = await getInfo();
  return {
    props: {"res" : loading_function_return}
  }
}

export default function Table(res: any) {
  const load_data = res.res;
  //console.log(load_data);

  let overall_table = [];
  for (let team in load_data.standings.standings[0].table) {
    console.log(load_data.standings.standings[0].table[team]);
    overall_table.push(load_data.standings.standings[0].table[team]);
  }

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
            <div className="max-w-6xl m-auto mt-10">
              <p className="m-auto justify-center text-2xl font-semibold text-center">Table</p>
                <li className="grid grid-cols-6 my-4 m-auto">
                    <p className="m-auto justify-center text-center">Position</p>
                    <p className="m-auto justify-center text-center">Team</p>
                    <p className="m-auto justify-center text-center">Name</p>
                    <p className="m-auto justify-center text-center">Played</p>
                    <p className="m-auto justify-center text-center">Points</p>
                    <p className="m-auto justify-center text-center">Form</p>
                </li>
                {overall_table.map((pos) => (
                  <li key={pos.team.id} className="grid grid-cols-6 my-4 m-auto">
                    <p className="m-auto justify-center text-center">{pos.position}</p>
                    <img src={pos.team.crest} alt="Team Emblem" className="m-auto justify-center w-10 text-center" />
                    <p className="m-auto justify-center text-center">{pos.team.name}</p>
                    <p className="m-auto justify-center text-center">{pos.playedGames}</p>
                    <p className="m-auto justify-center text-center">{pos.points}</p>
                    <div className="flex m-auto">
                      {pos.form.split(",").map((wdl:any) => (
                        (() => {
                          if (wdl.toString() == "W")
                             return <p key={pos.form} className="justify-center text-center p-2 m-1 w-12 bg-green-500 rounded-full">{wdl}</p>;
                          if (wdl.toString() == "D")
                             return <p key={pos.form} className="justify-center text-center p-2 m-1 w-12 bg-slate-500 rounded-full">{wdl}</p>;
                          else
                             return <p key={pos.form} className="justify-center text-center p-2 m-1 w-12 bg-red-500 rounded-full">{wdl}</p>;
                        })()
                      ))}
                    </div>
                  </li>
                ))}
            </div>
        </ul>
      </>
    );
  }
}
