import Collection from "../../../websocket/Classes/Collection";
import { Token } from "../../../websocket/Interface/User";
import Room from "../Classes/Room";

interface Storage {
    roomMap: Collection<Token, Room>
}

export default Storage;
