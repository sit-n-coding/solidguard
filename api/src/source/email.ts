import { ExploitDto } from '../exploit/dto';

export const emailHTML = (exploitDto: ExploitDto) => `
<p style="font-size: 14px; line-height: 140%;">
    Dear SolidGuard users,
    <br>
        Your subscribed contract has vulnerabilities to a new exploit. 
        The details are as follows and you can visit our website to learn more about this exploit!
    <br>
    <strong>
        Name: ${exploitDto.name}
        <br>
            Found by: ${exploitDto.author}
        <br>
            Affected Repository: ${exploitDto.targetAuthor}/${exploitDto.targetRepo}
        <br>
            ${exploitDto.description}
        <br>
    </strong>
    <code>
        ${exploitDto.script}
    </code>
    <br>
        &nbsp;
    <br>
    - SolidGuard
</p>
`;
