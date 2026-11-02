import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollExperience } from "@/components/ScrollExperience";
import { SignatureHome } from "@/components/SignatureHome";
export default function HomePage() {
 return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><ScrollExperience/><main id="conteudo" className="signature-home"><SignatureHome/></main><Footer/></>;
}
