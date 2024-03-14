import routes from "./routes";
import { useFecth,} from "src/utils/react-query";

export const useGetFabricatorSelectList = () => {
    return useFecth(routes.getFabricator, null, {
            select: (response) => {
            const { data } = response || {};
            if(!data) return []
            const selections = [];
            data.result.map((d) =>
                selections.push({
                value: d.id,
                label: d.device_fabricator_name + ' - ' + d.device_fabricator_desc,
                })
            );
            return selections;
        },
    });
}

export const useGetSensorFabricatorSelectList = () => {
    return useFecth(routes.getFabList, null, {
            select: (response) => {
            const { data } = response || {};
            if(!data) return []
            const selections = [];
            data.result.map((s) =>
                selections.push({
                value: s.id,
                label: s.sensor_fabricator_name
                })
            );
            return selections;
        },
    });
}