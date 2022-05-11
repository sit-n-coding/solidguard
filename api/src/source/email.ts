import { ExploitResponseDto } from '../exploit/dto';

export const emailHTML = (exploitDto: ExploitResponseDto) => {
  let concatNames = '';
  for (const targetName of exploitDto.targetNames) {
    if (concatNames) concatNames = concatNames.concat(', ');
    concatNames = concatNames.concat(targetName);
  }

  return `
<p style="font-size: 14px; line-height: 140%;">
    Dear SolidGuard users,
    <br>
        Your subscribed contract has vulnerabilities to a new exploit. 
        The details are as follows and you can visit our website to learn more about this exploit!
    <br>
    <strong>
        Name: ${exploitDto.name}
        <br>
            Found by: ${exploitDto.authorName}
        <br>
            Affected Smart Contract: ${concatNames} at ${exploitDto.targetAddr}
        <br>
            ${exploitDto.description}
        <br>
    </strong>
    <br>
        &nbsp;
    <br>
    - SolidGuard
</p>
`;
};
