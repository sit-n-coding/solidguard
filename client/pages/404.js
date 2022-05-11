import Colors from "../styles/colors"
import Link from 'next/link'
import Image from "next/image"
import Mascot404 from "../styles/mascot404.png"
import Typography from "@mui/material/Typography"

export default function Error404() {
    return (
        <div id={'NotFoundPage'} className='errorContainer'>
            <div className="errorImage">
                <Image src={Mascot404} alt={'mascot404.png'} />
            </div>
            <div className="errorMessageContainer">
                <div>
                    <Typography
                        variant="h2"
                        color={Colors.textDark}
                    >
                        404 Page Not Found
                    </Typography>
                </div>
                <p>
                    <Typography
                        variant="h6"
                        color={Colors.textDark}
                    >
                        Go back{` `}
                        <span className='errorLink'>
                            <Link href={'/'} passHref>
                                home
                            </Link>
                        </span>
                        .

                    </Typography>
                </p>
            </div>
        </div>
    );
}