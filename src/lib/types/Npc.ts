export default interface NpcType {
  name: string;
  lastName: string;
  picture: string;
  voice: { name: string; rate: string; pitch: string; style: string };
  personae: string;
}
