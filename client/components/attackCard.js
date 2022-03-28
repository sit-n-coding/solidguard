import * as React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AttackModal from "../components/attackModal"
import Colors from "../styles/colors.js"

const AttackCard = (props) => {

    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState("Processing");
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div className="AttackCardContainer" style={{ backgroundColor: Colors[5] }} >
            <div className="AttackCardTopRow">
                <div className="AttackCardTopRowItem" style={{ backgroundColor: Colors[3] }}>
                    <div style={{ width: "70%", overflowY: "scroll" }}>
                        <Typography
                            className="HomepageBlockText"
                            variant="h6"
                            align="left"
                            color={Colors.textLight}
                            noWrap
                        >
                            {props.attack.name}
                        </Typography>
                    </div>
                    <Typography
                        className="HomepageBlockText"
                        variant="h7"
                        align="left"
                        color={Colors.textLight}
                        noWrap
                    >
                        by {props.attack.author}
                    </Typography>

                </div>


            </div>

            <div className="AttackCardBottomRow">
                <div className="AttackCardDescriptionContainer">
                    <Typography
                        className="AttackCardDescription"
                        variant="body1"
                        align="left"
                        color={Colors.textDark}
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                        }}
                    >
                        {props.attack.description}
                    </Typography>
                </div>
                <div className="AttackCardButtonContainer">
                    <Button className="AttackCardButton" variant="contained" style={{ backgroundColor: Colors[3] }} onClick={() => handleOpen()}>
                        <Typography
                            variant="h6"
                            align="left"
                            color={Colors.textLight}
                        >
                            {props.author}
                            Link

                        </Typography>
                    </Button>
                    <AttackModal
                        open={open}
                        setOpen={setOpen}
                        attack={props.attack}
                        index={props.index}
                        attackList={props.attackList}
                        status={status}
                        setStatus={setStatus}
                    />
                </div>
            </div>
        </div >
    );
}

export default AttackCard;