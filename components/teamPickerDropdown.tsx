import { useState } from 'react';
import { Team } from '@types';
import { IMAGE_URL } from '@constants';

type Props = {
    teams: Team[];
    onChange?: (team: Team) => void;
    value: Team;
};

const TeamPickerDropdown = ({ teams, onChange, value }: Props) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    return (
        <>
            <div onClick={toggleDropdown} className="cursor-pointer">
                {value ? (
                    <div className=" px-3 py-1.5 border-naranja border-2 w-60 rounded-md relative flex ">
                        <button className="uppercase text-violeta text-sm flex items-center w-full">
                            <img
                                src={`${IMAGE_URL}/${value.badge}`}
                                alt=""
                                className=" w-8 h-8  "
                            />
                            <div className="flex justify-center w-full leading-4">
                                {value.name}
                            </div>
                            <img
                                src="../logos - iconos/Flecha.png"
                                alt=""
                                className="rotate-90 w-6 h-6 my-auto "
                            />
                        </button>
                    </div>
                ) : (
                    <div className=" px-3 py-3 border-naranja border-2 w-60 rounded-md relative flex ">
                        <span className="font-bold uppercase flex-1 text-sm text-center text-naranja">
                            No seleccionado
                        </span>
                        <img
                            src="../logos - iconos/Flecha.png"
                            alt=""
                            className="rotate-90 w-6 h-6  absolute top-1/2 right-2 -translate-y-1/2 "
                        />
                    </div>
                )}
            </div>

            <div
                className={
                    'absolute top-20 z-10  mt-2 p-3 border border-naranja rounded-md bg-blanco overflow-y-scroll max-h-80 ' +
                    (isDropdownVisible ? ' block' : 'hidden')
                }
            >
                {teams.map((team, idx) => (
                    <div key={idx}>
                        <button
                            className="uppercase text-violeta  p-1 text-sm hover:bg-naranja hover:text-blanco flex items-center w-full"
                            onClick={() => {
                                onChange(team);
                                toggleDropdown();
                            }}
                        >
                            <img
                                src={`${IMAGE_URL}/${team.badge}`}
                                alt=""
                                className=" w-8 h-8  "
                            />
                            <div className="flex justify-center w-full leading-4">
                                {team.name}
                            </div>
                        </button>
                        <hr className="border-gris-admin" />
                    </div>
                ))}
            </div>
        </>
    );
};

export default TeamPickerDropdown;
