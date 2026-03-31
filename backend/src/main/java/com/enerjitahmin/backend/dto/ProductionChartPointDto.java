package com.enerjitahmin.backend.dto;

public class ProductionChartPointDto {

    private String date;
    private double predicted;
    private double actual;

    public ProductionChartPointDto() {
    }

    public ProductionChartPointDto(String date, double predicted, double actual) {
        this.date = date;
        this.predicted = predicted;
        this.actual = actual;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getPredicted() {
        return predicted;
    }

    public void setPredicted(double predicted) {
        this.predicted = predicted;
    }

    public double getActual() {
        return actual;
    }

    public void setActual(double actual) {
        this.actual = actual;
    }
}
