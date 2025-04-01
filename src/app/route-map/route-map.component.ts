import { Component } from '@angular/core';
import {
  GoogleMap,
  // MapDirectionsRenderer,
  MapTransitLayer,
  MapPolyline,
  MapMarker,
} from '@angular/google-maps';
import { ShapeDetails } from '../types/gtfs.interface';
import { GtfsService } from '../services/gtfs.service';

@Component({
  selector: 'app-route-map',
  imports: [GoogleMap, MapTransitLayer, MapPolyline, MapMarker],
  templateUrl: './route-map.component.html',
  styleUrl: './route-map.component.scss',
})
export class RouteMapComponent {
  vertices: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#00FF00',
    strokeOpacity: 0.8,
    strokeWeight: 5,
    path: this.vertices,
  };
  selectedShape: string = 'SHP01';
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  selectedShapeMarkers: {
    position: google.maps.LatLngLiteral;
    label: string;
  }[] = [];

  constructor(private gtfsService: GtfsService) {}

  ngOnInit() {
    this.generateVertices();
  }

  options: google.maps.MapOptions = {
    center: { lat: -7.565993, lng: 110.87238 },
    zoom: 14,
  };

  generateVertices() {
    // load the shape details from the GTFS service
    const shape = this.gtfsService.getShapeDetails(this.selectedShape);

    // sort the shape points by shape_pt_sequence
    shape.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);

    shape.forEach((point) => {
      const lat = point.shape_pt_lat;
      const lng = point.shape_pt_lon;
      this.vertices.push({ lat, lng });
      this.selectedShapeMarkers.push({
        position: { lat, lng },
        label: point.shape_pt_sequence.toString(),
      });
    });
  }
}
