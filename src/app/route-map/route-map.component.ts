import { Component, signal, WritableSignal } from '@angular/core';
import {
  GoogleMap,
  // MapDirectionsRenderer,
  MapTransitLayer,
  MapPolyline,
  MapMarker,
} from '@angular/google-maps';
import { ShapeDetails } from '../types/gtfs.interface';
import { GtfsService } from '../services/gtfs.service';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-route-map',
  imports: [
    GoogleMap,
    MapTransitLayer,
    MapPolyline,
    MapMarker,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
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
  selectedShape: FormControl<string | null> = new FormControl(null);
  shapesList: string[] = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  selectedShapeMarkers: {
    position: google.maps.LatLngLiteral;
    label: string;
  }[] = [];

  showMaps: boolean = false;

  constructor(
    private gtfsService: GtfsService,
    // private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router
  ) {
    this.showMaps = this.gtfsService.validateGTFSData();
  }

  ngOnInit() {
    // this.generateVertices();
    const shapesArray = [...this.gtfsService.trip_ID_shape_ID_map.values()];
    this.shapesList = [...new Set(shapesArray)];
    this.selectedShape.valueChanges.subscribe((value) => {
      this.vertices = [];
      this.selectedShapeMarkers = [];
      this.polylineOptions.path = [];

      if (value) {
        console.log('Selected shape ID:', value);
        this.generateVertices(value);
      }

      console.log(
        'vertices length',
        this.vertices.length,
        this.polylineOptions.path.length,
        this.selectedShapeMarkers.length
      );
      // this.cdr.detectChanges(); // Trigger change detection manually
    });
  }

  options: google.maps.MapOptions = {
    center: { lat: -7.565993, lng: 110.87238 },
    zoom: 14,
  };

  generateVertices(shapeID: string) {
    // load the shape details from the GTFS service
    const shape = this.gtfsService.getShapeDetails(shapeID);

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

    this.zone.run(() => {
      this.polylineOptions = {
        ...this.polylineOptions,
        path: [...this.vertices],
      };
      this.selectedShapeMarkers = [...this.selectedShapeMarkers];
    });
  }

  gotoGTFSBuilder() {
    this.router.navigate(['/']);
  }
}
