import { CarSizeInit } from "./vehiclesController"
import { FuelTypeInit } from "./fuelTypeController"

export async function initAllVehiclesTabs(container) {
    const $tabList = container.querySelector('#tabList')

    $tabList.innerHTML = `
            <li class="nav-item d-flex">
                <a class="nav-link active" data-bs-toggle="tab" href="#carSizeTab">Vehículos</a>
            </li>
            <li class="nav-item d-flex">
                <a class="nav-link " data-bs-toggle="tab" href="#FuelTypeTab">Tipos de combustible</a>
            </li>
            `
    CarSizeInit(container)
    FuelTypeInit(container)
}