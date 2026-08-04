import {Boxes} from 'lucide-react';
export default function Logo({light=false}){return <a className={`logo ${light?'logo-light':''}`} href="/"><span><Boxes size={22}/></span><b>TRUSTLOGIX</b></a>}
